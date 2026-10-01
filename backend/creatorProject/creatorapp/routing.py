from django.urls import re_path, path
from .consumers import ChatConsumer, NotificationConsumer

websocket_urlpatterns = [
    path("ws/chat/<uuid:conversation_id>/", ChatConsumer.ChatConsumerWebSockets.as_asgi()),
    path("ws/notifications/", NotificationConsumer.NotificationConsumer.as_asgi())
]