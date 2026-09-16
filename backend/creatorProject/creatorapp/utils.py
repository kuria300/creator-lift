import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import exception_handler

#custom exception handler for rest framework
def custom_exception_handler(exc, context):
    # call REST framework default exception handler 
    # to get the error response then add status code and all
    response = exception_handler(exc, context)

    if response is not None:
        response.data={
            "success": False,
            "error": response.data.get('detail')
        }

    return response

# def get_client_ip(request):
#     """ since im using nginmx as my reverse proxy remoteip get ip addres of proxy
#         to get the ip of the client sending to proxy we extract from request.METa( populated from proxy or web server requests handed to django
#         its populated the time views run)
#     """


def verify_turnstile(token, remote_ip=None):
    
    url='https://challenges.cloudflare.com/turnstile/v0/siteverify'
    data={
        'secret': settings.TURNSTILE_SECRET_KEY,
        'response':token,
        'remoteip': remote_ip
    }

    try:
        verify_ts = requests.post(url, data=data, timeout=5)
        res = verify_ts.json()
    except requests.RequestException:
        # Handles network timeouts or connection drops
        return False

    
    return res.get('success', False)
