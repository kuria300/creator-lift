from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import Conversations, Messages
from rest_framework.response import Response
from rest_framework import exceptions
from ..serializer import MessageSerializer

class ConversationMessagesView(APIView):
    """
    retriieve messages over HTTPS for given conversation_id and user must be creator + brand
    """
    permission_classes = [IsAuthenticated]
    throttle_scope= "chat messages"

    def get(self, request, conversation_id):
        try:
            conversation = Conversations.objects.select_related('creator', 'brand').get(id=conversation_id)
        except Conversations.DoesNotExist:
            return exceptions.NotFound('Conversation not found')

        # Check if the user is either the brand or the creator in the conversation
        if request.user != conversation.brand and request.user != conversation.creator.usersdata:
            return exceptions.PermissionDenied('You do not have permission to view this conversation')

        # Retrieve messages for the conversation
        message= Messages.objects.filter(conversation=conversation).select_related('sender').order_by('created_at')

        # Serialize the messages
        serialized_messages = MessageSerializer(message, many=True).data

        return Response({"data": serialized_messages}, status=200)
