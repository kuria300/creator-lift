from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import Conversations, Messages, Notifications
from rest_framework.response import Response
from rest_framework import exceptions
from ..serializer import MessageSerializer
from rest_framework.throttling import ScopedRateThrottle
from django.db.models import CharField, Count, F, IntegerField, OuterRef, Q, Subquery, Value
from django.db.models.functions import Coalesce


def _display_name(u):
    return u.username or u.email


class ConversationMessagesView(APIView):
    """
    retriieve messages over HTTPS for given conversation_id and user must be creator + brand
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope= "chat_messages"

    def get(self, request, conversation_id):
        try:
            conversation = Conversations.objects.select_related('creator', 'brand').get(id=conversation_id)
            print(conversation_id)
        except Conversations.DoesNotExist:
            raise exceptions.NotFound('Conversation not found')

        # Check if the user is either the brand or the creator in the conversation
        if request.user.id not in (conversation.brand_id, conversation.creator.usersdata_id):
          raise exceptions.PermissionDenied("You do not have permission to view this conversation")

        # Retrieve messages for the conversation
        message= Messages.objects.filter(conversation=conversation).select_related('sender').order_by('created_at')

        # Serialize the messages
        serialized_messages = MessageSerializer(message, many=True).data

        return Response({"data": serialized_messages}, status=200)


class MyConversationsView(APIView):
    """List the logged-in user's conversations (as brand or as creator)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        last_msg = Messages.objects.filter(conversation=OuterRef("pk")).order_by("-created_at")

        # Messages from the OTHER person that this user hasn't read.
        # A subquery avoids a negated filter inside an aggregate over a joined table.
        unread = (
            Messages.objects
            .filter(conversation=OuterRef("pk"), is_read=False)
            .exclude(sender=user)
            .order_by()
            .values("conversation")
            .annotate(n=Count("id"))
            .values("n")
        )

        conversations = (
            Conversations.objects
            .filter(Q(brand=user) | Q(creator__usersdata=user))
            .select_related("brand", "creator__usersdata")
            .annotate(
                last_message=Subquery(last_msg.values("message")[:1]),
                last_attachment=Subquery(last_msg.values("attachment_url")[:1]),
                last_message_at=Subquery(last_msg.values("created_at")[:1]),
                unread_count=Coalesce(Subquery(unread, output_field=IntegerField()), 0),
                # Conversations has no title: use the request title of its deal or proposal
                project=Coalesce(
                    "deal__request__title",
                    "proposal__request__title",
                    Value("", output_field=CharField()),
                ),
            )
            .order_by(F("last_message_at").desc(nulls_last=True), "-created_at")
        )

        data = []
        for c in conversations:
            other = c.creator.usersdata if c.brand_id == user.id else c.brand

            data.append({
                "id": str(c.id),
                "other_name": _display_name(other),
                "project": c.project,
                "last_message": c.last_message or ("Attachment" if c.last_attachment else ""),
                "last_message_at": c.last_message_at.isoformat() if c.last_message_at else None,
                "unread_count": c.unread_count,
            })

        return Response({"data": data}, status=200)

class UnreadNotificationsCountView(APIView):
    """fetch notification of unread and show in client side a count"""

    def get(self, request):
        try:
            count= Notifications.objects.filter(user=request.user, type='new_message', is_read=False).count()
            return Response({'count': count})
        except Exception as e:
            return Response({"error": "An error occurred while retrieving notification count."}, status=500)