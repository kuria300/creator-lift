import jwt
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.response import Response
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from ..authentication.jwt_utils import jwt_decode

@database_sync_to_async
def get_user(user_id):
    User=get_user_model()
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        scope = dict(scope)  # we first copythe scope dont mosify the scope directly
        scope["user"] = AnonymousUser()  # set by default and wen error occurs 401 we set as anonymous then permissions decide if i can access 
        scope['token_exp']=0

        # # only return o, 1 
        # query= dict(x.split('=', 1) for x in scope['query_string'].decode().split('&') if '=' in x)   # generate one at a time generator
        # token=query.get('token')

        query_string = scope.get('query_string', b'').decode()
        parsed_queries = parse_qs(query_string) # example with 2 will look like {'token': ['token_value1', 'token_value2']}

        token_list = parsed_queries.get('token')
        token = token_list[0] if token_list else None

        if token:
            try:
                payload=jwt_decode(token=token) # add token exp for the token so they expire at same time 
                scope['token_exp']= payload['exp']
                scope['user']= await get_user(payload.get('user_id'))
            except (jwt.InvalidTokenError, KeyError):
                pass                  

        print("MIDDLEWARE reached:", scope.get("path"))
    
        return await super().__call__(scope, receive, send)
