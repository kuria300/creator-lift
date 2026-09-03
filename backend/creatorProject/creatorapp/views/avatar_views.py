import uuid
import boto3
from ..models import Profiles
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ProfileAvatarPreSign(APIView):
    def post(slf, request):
        """
        this helps generate a presigned url to send to the frontend so frontend can use to uplaod images securely

        without exposing master credentials or overloadin the backend server
        """
        file_ext= request.data.get('file_ext', 'jpg')

        if file_ext.lower() not in ('jpg', 'jpeg', 'png'):
            return Response({"error":"only JPG, JPEG are allowed"}, status=status.HTTP_400_BAD_REQUEST)

        mime_ext = 'jpeg' if file_ext in ('jpg', 'jpeg') else file_ext
        content_type = f'image/{mime_ext}'

        # unique filename to save to db
        pre_signed= f'avatar/{request.user.id}-{uuid.uuid4().hex[:4]}.{file_ext}'

        s3=boto3.client(
            's3',
            endpoint_url =settings.MINIO_ENDPOINT,
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_ACCESS_KEY,
            region_name='us-east-1'
        
        )

        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.MINIO_BUCKET,
                'Key': pre_signed,
                'ContentType': content_type,
            },
            ExpiresIn=300,  # 5 minutes
        )

        browser_url = presigned_url.replace(
            settings.MINIO_ENDPOINT,
            f"{settings.MINIO_PUBLIC_URL}"
        )

        public_url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{pre_signed}"

        return Response({'presigned_url': browser_url, 'public_url': public_url,}, status=200)


class AvatarSaveView(APIView):
    def patch(self, request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

        avatar_url = request.data.get('avatar_url')
        if not avatar_url:
            return Response({'error': 'avatar_url is required'}, status=400)

        profile.avatar_url = avatar_url
        profile.save()

        return Response({'avatar_url': profile.avatar_url}, status=200)


