import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import exception_handler

#custom exception handler for rest framework
def custom_exception_handler(exc, context):
    # call rest_framework exception handler
    # to get the error response
    response = exception_handler(exc, context)

    if response is None:   # a real bug, not a DRF error
        return None     # Django will produce the 500

    data = response.data

    if isinstance(data, dict) and "detail" in data:
        message, details = str(data["detail"]), None      
    else:
        message, details = "Invalid input.", data         

    response.data = {
        "success": False,
        "error": message,
        "details": details,
    }
    return response



def verify_turnstile(token, remote_ip=None):

    if not token:
        print("Turnstile: no token received from the frontend")
        return False
    
    url='https://challenges.cloudflare.com/turnstile/v0/siteverify'
    data={
        'secret': settings.TURNSTILE_SECRET_KEY,
        'response':token,
        'remoteip': remote_ip
    }

    try:
        verify_ts = requests.post(url, data=data, timeout=5)
        res = verify_ts.json()
    except (requests.RequestException, ValueError) as e:
        # Handles network timeouts or connection drops
        print("Turnstile: request to Cloudflare failed:", repr(e))
        return False

    
    return res.get('success', False)
