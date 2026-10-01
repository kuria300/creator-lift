"""
ASGI config for creatorProject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'creatorProject.settings')

django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from creatorapp.chat.middleware import JWTAuthMiddleware
from channels.auth import AuthMiddlewareStack
from creatorapp.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": django_asgi_app,
 
   "websocket": 
        JWTAuthMiddleware(
                URLRouter(
                    websocket_urlpatterns
                )
        )
    
    
})


# this is how scope looks like when uvicoen populates it before any code runs (example)
# {
#     "type": "websocket",
#     "asgi": {"version": "3.0", "spec_version": "2.3"},
#     "http_version": "1.1",
#     "scheme": "ws",                       # see the note below
#     "server": ("127.0.0.1", 8000),
#     "client": ("10.0.0.5", 51234),        # see the note below
#     "root_path": "",
#     "path": "/ws/chat/lobby/",            # NO query string here
#     "raw_path": b"/ws/chat/lobby/",
#     "query_string": b"token=a123",        # bytes, not str so we must decode
#     "headers": [                          # list of (bytes, bytes) tuples, names lowercase
#         (b"host", b"web.com"),
#         (b"upgrade", b"websocket"),
#         (b"connection", b"upgrade"),
#         (b"origin", b"https://web.com"),
#         (b"sec-websocket-key", b"dGhlIHNhbXBsZQ=="),
#         (b"sec-websocket-version", b"13"),
#         (b"cookie", b"sessionid=abc..."),
#     ],
#     "subprotocols": [],
#     "state": {},
# }

