import requests
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import Userserializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from creatorapp.authentication.authentication import JWTAuthentication

User = get_user_model() #referrrence the currently active usermodel in auth_user_model in settings.py
authentication= JWTAuthentication()

# Create your views here.
class homePage(APIView):
    def get(self, request):
        my_message={'message':'hello', 'age':23}
        
        return Response(data=my_message, status=status.HTTP_200_OK)

class LogoutPage(APIView):
    def delete(self,request):
        response= Response({'message': 'successfully Logged out'})
        response.delete_cookie('access_token')
        return response


class normal_loginPage(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # disables auth entirely

    def post(self, request):
        data=request.data


        if 'email' not in data or 'password' not in data:
            return Response({'error':'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            existing_email=User.objects.get(email=data.get('email'))

            if not existing_email.check_password(data.get('password')):
                return Response({'error':'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
            
            # create token
            token= authentication.create_token(existing_email)

            serializer=Userserializer(existing_email)

             
            response= Response({"data": serializer.data,'is_new': False}, status=status.HTTP_200_OK)

            response.set_cookie(
                key='access_token',
                value=token,
                httponly=True,
                secure=False,
                max_age=60 * 30
            )
            return response
        except User.DoesNotExist:

            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)


class RegisterPage(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def post(self, request):
        data=request.data

        if 'email' not in data or 'password' not in data or 'role' not in data:
            return Response({'error':'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer= Userserializer(data=data)

        # serializer.is_valid(raise_exception=True):  for custom_exeception_handler
        if serializer.is_valid():
            print(serializer.validated_data)
            user_obj=serializer.save()
            # print(mock) creates a user object

            token= authentication.create_token(user_obj)

            response= Response({'data':serializer.data}, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='access_token',
                value=token,
                httponly=True,
                secure=False,
                max_age=60 * 30
            )

            return response
   
        return Response({'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  

    def post(self, request):
        code = request.data.get('code')
        role=request.data.get('role')

        if not code:
            return Response({'error':'no code received'}, status=status.HTTP_400_BAD_REQUEST)
        #print(code)
        token='https://oauth2.googleapis.com/token'
        data={
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_SECRET,
            'redirect_uri': 'postmessage', #I’ll handle the ticket myself, don’t send it anywhere else.” then send to server
            'grant_type': 'authorization_code'
        }
            
        token_response=requests.post(token, data=data).json()
        if 'access_token' not in token_response:
            return Response({'error':'no access token available from Google'}, status=status.HTTP_400_BAD_REQUEST)

        #print(token_response)

        access_token=token_response["access_token"]
        headers={
            'Authorization': f'Bearer {access_token}'
        }

        # print(access_token)

        user_info=requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

        print(user_info)

        user_data={
            "username": user_info.get('name'),
            "email":user_info.get('email'),
            "picture":user_info.get('picture'),
            "role":role
        }
        try:
            user_email=User.objects.get(email=user_info.get('email'))
            token= authentication.create_token(user_email)
            #existing user
            serializer = Userserializer(user_email)
            response= Response({"data": serializer.data, "is_new": False}, status=status.HTTP_200_OK)

            response.set_cookie(
                key='access_token',
                value=token,
                httponly=True,
                secure=False,
                max_age=60 * 30
            )

            return response
            
        except User.DoesNotExist:
            serializer= Userserializer(data=user_data)

            if serializer.is_valid():
                print(serializer.validated_data)
                mock=serializer.save()

                token= authentication.create_token(mock)

                response= Response({"data":serializer.data,"is_new":True}, status=status.HTTP_201_CREATED)

                response.set_cookie(
                key='access_token',
                value=token,
                httponly=True,
                secure=False,
                sameSite='Lax',
                max_age=60 * 30
                )

                return response
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

        

