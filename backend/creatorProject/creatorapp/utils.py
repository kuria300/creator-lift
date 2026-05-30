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