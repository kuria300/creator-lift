import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import Conversations, Messages, Notifications
from django.db import transaction


@database_sync_to_async
def upsert_message_notification(conversation_id, user_id):
    """
    create or update a notification for a message fpr a user in a convo

    Create one unread notification for this conversation.

    If an unread notification already exists, reuse it
    instead of creating another one.
    
    """

    notif, created= Notifications.objects.get_or_create(
        conversation_id=conversation_id, 
        user_id=user_id, 
        type='New Message', 
        is_read=False, 
        defaults={'title': 'New message', 'message': 'You have a new message'}
     )

    # SynchronousOnlyOperation: You cannot call this from an async context error. so we return json serializable dict instead of notif object
    return {
        "id": str(notif.id),
        "conversation_id": str(notif.conversation_id),
        "user_id": notif.user_id,
        "type": notif.type,
        "title": notif.title,
        "message": notif.message,
        "is_read": notif.is_read,
        "created_at": notif.created_at.isoformat(),
    }

@database_sync_to_async
def mark_message_notifications_as_read(user_id):
    """ mark all message notifications as read for a user in a conversation also return the number of notifications marked as"""
    return (
        Notifications.objects.filter( user_id=user_id, type="New Message",is_read=False).update(is_read=True)
    )



class NotificationConsumer(AsyncWebsocketConsumer):
    """ this consumer is responsible for sending notifications to the user over websockets """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.room_group_name = None

    async def send_json(self, payload):
        await self.send(text_data=json.dumps(payload))

    async def connect(self):
        """ accept the connection and add the user to a group based on their user id so we can send notifications to them """

        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close(code=4001)  # close the connection with a custom code for unauthorized access
            return

        self.room_group_name = f"user_{self.user.id}_notifications"

        # Add the user to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_json({"type": "error", "message": "Invalid JSON."})
            return

        if not isinstance(data, dict):
            await self.send_json({"type": "error", "message": "Payload must be a JSON object."})
            return

        if data.get("type") == "mark_all_read":
            count = await mark_message_notifications_as_read(self.user.id)
            await self.send_json({"type": "notifications_read", "count": count})
        else:
            await self.send_json({"type": "error", "message": "Unknown event type."})

    async def new_notification(self, event):
        notification = event.get("notification")
        if not notification:
            return
        await self.send_json({
            "type": "new_notification",
            "notification": notification,
        })