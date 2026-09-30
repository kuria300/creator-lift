def set_auth_cookie(response, token):
    response.set_cookie(
        key='access_token',
        value=token,
        httponly=True,
        secure=False,
        max_age=60 * 60 * 2
    )