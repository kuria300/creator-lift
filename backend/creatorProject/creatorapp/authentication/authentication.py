from datetime import timedelta, datetime, timezone
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User=get_user_model()
SECRET_KEY= settings.SECRET_KEY

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        """ get token sent by client """
        #LOW-LEVEL straight from wsgi server it converts headers into caps
        #auth_header= request.META.get('HTTP_AUTHORIZATION') 
        # auth_header=request.headers.get('Authorization')
        auth_header= request.COOKIES.get('access_token')

        if not auth_header:
            raise exceptions.AuthenticationFailed('No Token Provided')

        try:
            # prefix, token= auth_header.split(" ")
            # if prefix.lower() != 'bearer':
            #     raise exceptions.AuthenticationFailed('Invalid Prefix')

            payload =jwt.decode(auth_header, SECRET_KEY, algorithms=['HS256'])

            user= User.objects.get(id=payload.get('user_id'))

            return (user, auth_header)
        except (jwt.ExpiredSignatureError,jwt.InvalidTokenError, User.DoesNotExist) as e:
            print(str(e))
            raise exceptions.AuthenticationFailed('Invalid or expired Token')

                
    @classmethod
    def create_token(cls, user):
        """ create a token using user data"""

        payload={
            'user_id': str(user.id),
            'user_email':user.email,
            'exp':(datetime.now(timezone.utc)+timedelta(minutes=30))
        }

        """ encode jwt with secret_key """
        jwt_token=jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        return jwt_token

    @classmethod
    def get_token_clean(cls, token):
        auth_header= request.headers.get('Authorization')

        if not auth_header:
            return None
        
        try:
            prefix, token= auth_header.split(" ")

            if prefix.lower() != 'Bearer':
                return None

            return token
        except Exception as e:
            print(str(e))
            return None

        


