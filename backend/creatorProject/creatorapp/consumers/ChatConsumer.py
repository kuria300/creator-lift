import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import Conversations, Messages, Notifications
from django.db import transaction
from .NotificationConsumer import upsert_message_notification
from django.core.exceptions import PermissionDenied, ValidationError

@database_sync_to_async
def get_conversation_for_user(conversation_id, user):
    """ return conv for a user if user is one of creator or brand else none"""

    try:
        conversation= Conversations.objects.select_related('creator', 'brand').get(id=conversation_id)
    except (Conversations.DoesNotExist, ValidationError, ValueError):
        return None

    creator_userId= conversation.creator.usersdata_id
    if user.id == conversation.brand_id:
        other_id = creator_userId
    elif user.id == creator_userId:
        other_id = conversation.brand_id
    else:
        return None


    return {
        #convert to str due to JSON is not serializable for UUID and datetime objects
        "id": str(conversation.id),
        "other_id": other_id,
        "creator_id": creator_userId,
        "brand_id": conversation.brand_id,                    
    }

@database_sync_to_async
def save_message(conversation_id, sender_id, message, attachment_url=None, attachment_type=None, attachment_size=None):
    """ save message to db and return the message object also update the notification table"""

    with transaction.atomic(): # treat as transaction
        conv = Conversations.objects.select_related('creator').get(id=conversation_id)  # here we are fetching the conversation again to ensure we have the latest state of the conversation from the database.This is important because there might be concurrent updates to the conversation, and we want to make sure we are working with the most recent data.

        if sender_id not in [conv.brand_id, conv.creator.usersdata_id]:
            raise PermissionDenied("Sender is not authorized in this conversation.")

        msg = Messages.objects.create(conversation_id=conv.id, sender_id=sender_id, message=message, attachment_url=attachment_url, attachment_type=attachment_type, attachment_size=attachment_size)
       
        recipient_id = conv.creator.usersdata_id if sender_id == conv.brand_id else conv.brand_id
        notif = upsert_message_notification(conversation_id, recipient_id)
        
        # we return as dict to allow easy serialization to json and sending over websocket as json
    return {
         "message": {
        "id": str(msg.id),
        "sender": str(msg.sender_id),
        "message": msg.message,
        "attachment_url": msg.attachment_url,
        "attachment_type": msg.attachment_type,
        "attachment_size": msg.attachment_size,
        "is_read": msg.is_read,
        "created_at": msg.created_at.isoformat(),
    },
    "notification": notif,
    }

@database_sync_to_async
def mark_messages_as_read(conversation_id, user_id):
    """ mark message as read for a user in a conversation also return thenumber of messages marked as read"""

    try:
        conversation = (
            Conversations.objects
            .select_related("creator")
            .get(id=conversation_id)
        )

    except (Conversations.DoesNotExist, ValidationError, ValueError): 
        return 0

    creator_user_id = conversation.creator.usersdata_id
    brand_user_id = conversation.brand_id

    # Make sure user belongs to conversation.
    if user_id not in [creator_user_id,brand_user_id]:
        return 0
    # find all messsages in this coonvo that are not read and not sent by this user and mark them as read
    unread_to_read_msg= Messages.objects.filter(conversation_id=conversation_id, is_read=False).exclude(sender_id=user_id).update(is_read=True)

    # update only the notifications for this user and this conversation to is_read=True
    Notifications.objects.filter(conversation_id=conversation_id, user_id=user_id, is_read=False).update(is_read=True)

    return unread_to_read_msg

   

class ChatConsumerWebSockets(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs) 
        self.user = None
        self.room_group_name = None

    # helpers 
    async def send_json(self, payload):
        await self.send(text_data=json.dumps(payload))

    async def send_error(self, message):
        await self.send_json({"type": "error", "message": message})

    async def connect(self):
        """ 
        Create one websocket connection for the authenticated user.

        The user does NOT need to open a conversation first.
        """

        self.user= self.scope['user']


        if self.user.is_anonymous:
            await self.close(code=4001)  # close the connection with a custom code for unauthorized access
            return

        print("User connected data:", self.user.id)

        self.room_group_name = (f"user_{self.user.id}")

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

        print(
            f"User {self.user.id} connected to "
            f"{self.room_group_name}"
        )
    async def disconnect(self, close_code):
        """ leave the group when the user disconnects """

        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )

    async def receive(self, text_data):
        """receive message from websocket and handle it based on the type of message received"""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error("Invalid JSON data")
            return

        if not isinstance(data, dict):
            await self.send_error("Payload must be a JSON object")
            return

        event_type = data.get("type")

        if event_type == "message":
            await self.handle_message(data)
        elif event_type == "mark_read":
            await self.handle_mark_read(data)
        else:   
            await self.send_error("Invalid event type")


    async def handle_message(self, data):
        """ handle incoming message from websocket, save it to the database, and send it to the other user in the conversation """
        conversation_id= data.get("conversation_id")
        message= data.get("message")
        attachment_url= data.get("attachment_url")
        attachment_type= data.get("attachment_type")
        attachment_size= data.get("attachment_size")

        if not conversation_id:
            await self.send_error("conversation_id is required")
            return

        if not message and not attachment_url:
            await self.send_error("Message or attachment is required")
            return
        
        conversation = await get_conversation_for_user(conversation_id, self.user)
        if not conversation:
            await self.send_error("You do not have access to this conversation.")
            return

        # Save the message to the database and notification
        try:
            result = await save_message(
                conversation_id=conversation.get('id'),
                sender_id=self.user.id,
                message=message,
                attachment_url=attachment_url,
                attachment_type=attachment_type,
                attachment_size=attachment_size,
            )
        except PermissionDenied:
            await self.send_error("You are not authorized to send messages here.")
            return

        saved_message = result["message"]
        notification = result["notification"]
        # goes through 2 hops 1 through redis and alls consumer B's group_send
        await self.channel_layer.group_send(
            f"user_{conversation.get('other_id')}",
            {
                "type": "new_message",
                "conversation_id": conversation.get('id'),
                "message": saved_message,
            },
        )
        # this is the notification to the other user that a new message has been sent to them 
        # when a user types a message  it travels through websockets to server  after server saves to db, this dict is what is sent to other useer it travels through redis then to new_message of other user to browser
        if notification["created"]:
            await self.channel_layer.group_send(
                f"user_{conversation['other_id']}_notifications",
                {
                "type": "new_notification", 
                "notification": notification
                },
            )
        
        # confirm message was saved user can replace loading with actual message send back to user who sent immediately
        await self.send_json({
            "type": "message_sent",
            "conversation_id": conversation["id"],
            "data": saved_message,
        })

    async def handle_mark_read(self, data):
        """ handles the mark_read event from the websocket, marking messages as read for the user in the conversation """

        conversation_id = data.get("conversation_id")

        if not conversation_id:
            await self.send_error("conversation_id is required")
            return

        conversation = await get_conversation_for_user(conversation_id, self.user)
        if not conversation:
            await self.send_error("You do not have access to this conversation.")
            return

        # Mark messages as read in the database
        num_marked_as_read = await mark_messages_as_read(conversation_id=conversation.get('id'), user_id=self.user.id)
        # update also client side after updating db sent over websocket to user b 
        if num_marked_as_read:
            await self.channel_layer.group_send(
                f"user_{self.user.id}_notifications",
                {"type": "notifications_changed"},
            )

        await self.send_json({
            "type": "mark_read",
            "conversation_id": conversation.get('id'),
            "num_marked_as_read": num_marked_as_read,
        })
        

    async def new_message(self, event):
        """ 
        send the new message to the user over websocket

        thi ethod is called when a new message is sent to the group that this user is part of send to users websocket conn

        event is sent by the handle_message method when a new message is saved to the database and notification is created

        event["type"]             # "new_message"
        event["conversation_id"]  # "3f2a..."
        event["new_message"]      # the saved message dict
        its sent by the handle_message method when a new message is saved to the database and notification is created

        receive → group_send(dict) → Redis → recipient's new_message(event=dict) → send_json → recipient's browser. this is the flow of a new message from sender to recipient over websockets
         
        """

        await self.send_json({
            "type": "new_message",
            "conversation_id": event["conversation_id"],
            "data": event["message"],
        })



        















