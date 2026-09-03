from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import Userserializer, Goggleserializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from creatorapp.authentication.authentication import JWTAuthentication
from ..models import Profiles, AIMessage, AIConversation
from ..ai.services.agent import AIagent
from ..ai.serializers import ChatInputSerializer, ChatOutputSerializer


agent = AIagent()

class ChatView(APIView):
    def post(self, request):
        data_serialized = ChatInputSerializer(data=request.data)

        if not data_serialized.is_valid():
            return Response({'error': data_serialized.errors}, status=400)

        message= data_serialized.validated_data.get('message')
        conversation_id= data_serialized.validated_data.get('conversation_id')
        sender_id=request.user.id
        try:
            result = agent.handle_message(
                message=message,
                conversation_id=conversation_id,
                sender_id=sender_id
                )
            output_serializer = ChatOutputSerializer(data=result)
            output_serializer.is_valid()
            return Response({'result': output_serializer.data}, status=200)
        
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class ChatHistoryView(APIView):
    """
    GET /api/chat/history/?conversation_id=uuid
 
    Returns full conversation history for a given conversation_id.
    Called by React when the chatbot opens and a saved conversation_id exists.
    """
 
    def get(self, request):
        conversation_id = request.query_params.get('conversation_id')
 
        if not conversation_id:
            return Response({'messages': []}, status=200)
 
        try:
            conversation = AIConversation.objects.get(
                id=conversation_id,
                user_id=request.user.id,   
            )
        except AIConversation.DoesNotExist:
            return Response({'messages': []}, status=200)
 
        messages = AIMessage.objects.filter(
            conversation=conversation
        ).order_by('created_at')
 
        data = [
            {'sender': m.role, 'text': m.content}
            for m in messages
        ]
 
        return Response({'messages': data}, status=200)
 







