from rest_framework.views import APIView
from rest_framework.response import Response
from creatorapp.authentication.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializer import Userserializer
from django.contrib.auth import get_user_model


User=get_user_model()
authentication= JWTAuthentication()

class ProfilePage(APIView):
    def get(self, request):

        print(request.user)
        print(request.auth)


        return Response({'msg':'This route is protected'})
    
class MeView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        serializer = Userserializer(request.user)
        return Response(serializer.data, status=200)

