import jwt
from django.conf import settings

SECRET_KEY= settings.SECRET_KEY

def jwt_decode(token):
    """ return a decded token """
    return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
