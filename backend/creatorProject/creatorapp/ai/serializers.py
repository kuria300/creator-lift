from rest_framework import serializers


class ChatInputSerializer(serializers.Serializer):
    """
    Validates POST /api/chat/ body coming from Next.js.

    """
    message = serializers.CharField(
        min_length=1,
        max_length=2000,
        error_messages={
            'blank':      'Message cannot be empty.',
            'max_length': 'Message cannot exceed 2000 characters.',
        }
    )
    conversation_id = serializers.UUIDField(required=False, allow_null=True)


class ChatOutputSerializer(serializers.Serializer):
    """
    Shapes the reply sent back to Next.js after every message.
    Plain Serializer — not tied to a model, just shapes outgoing data.

    """
    reply= serializers.CharField()
    conversation_id = serializers.UUIDField()