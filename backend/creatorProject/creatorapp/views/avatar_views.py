import uuid
import boto3
from ..models import Profiles, Offers
from botocore.exceptions import ClientError
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

ALLOWED_ATTACHMENTS = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
ALLOWED_TYPES = set(ALLOWED_ATTACHMENTS.values())
MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024 

class ProfileAvatarPreSign(APIView):
    def post(slf, request):
        """
        this helps generate a presigned url to send to the frontend so frontend can use to uplaod images securely

        without exposing master credentials or overloadin the backend server
        """
        file_ext = str(request.data.get('file_ext', '')).lower().lstrip('.')

        if file_ext.lower() not in ('jpg', 'jpeg', 'png'):
            return Response({"error":"only JPG, JPEG are allowed"}, status=status.HTTP_400_BAD_REQUEST)

        mime_ext = 'jpeg' if file_ext in ('jpg', 'jpeg') else file_ext
        content_type = f'image/{mime_ext}'

        # unique filename to save to db
        pre_signed= f'avatar/{request.user.id}-{uuid.uuid4().hex[:4]}.{file_ext}'

        # initilaize a connection to minio using bot3 client without exposing credentials and overloading backend
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

        # this replaces the minio endpoint with public url so frontend can upload directly
        browser_url = presigned_url.replace(
            settings.MINIO_ENDPOINT,
            f"{settings.MINIO_PUBLIC_URL}"
        )

        public_url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{pre_signed}"

        return Response({'presigned_url': browser_url, 'public_url': public_url, 'content_type': content_type,  'key': pre_signed}, status=200)


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



# image

class OfferPresign(APIView):
    def post(self, request):
        """ this helps generate a presigne url to send to frontend so frontend can use it to upload to  minio"""

        file_ext = request.data.get('file_ext', 'jpg')

        if file_ext.lower() not in ('jpeg', 'jpg', 'png'):
            return Response({'error':'only jpeg, jpg and png allowed'}, status=status.HTTP_400_BAD_REQUEST)

        mime_type = 'jpeg' if file_ext in ('jpg', 'jpeg') else file_ext
        content_type = f'image/{mime_type}'

        filename = f'image/{request.user.id}-{uuid.uuid4().hex[:4]}.{file_ext}'

        s3=boto3.client(
            's3',
            endpoint_url =settings.MINIO_PUBLIC_URL,
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_ACCESS_KEY,
            region_name='us-east-1'
        
        )

        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.MINIO_BUCKET,
                'Key': filename,
                'ContentType': content_type,
            },
            ExpiresIn=300,  # 5 minutes
        )

        public_url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{filename}"

        return Response({'presigned_url': presigned_url, 'public_url': public_url}, status=200)


class OfferSaveView(APIView):
    def patch(self, request):
        try:
            offer = Offers.objects.get(creator=request.user)
        except Offers.DoesNotExist:
            return Response({'error': 'Offer not found'}, status=404)

        image_url = request.data.get('image_url')
        if not image_url:
            return Response({'error':'image_url is required'}, status=status.HTTP_400_BAD_REQUEST)

        offer.image_url = image_url
        offer.save()

        return Response({'image_url': offer.image_url}, status=200)


class messagesPresign(APIView):
    """ Generate a presign ur to send to frontend to upload the attachments user sends to minio"""
    def post(self, request):

        file_ext = str(request.data.get('file_ext', '')).lower().lstrip('.')
        content_type = ALLOWED_ATTACHMENTS.get(file_ext)

        if not content_type:
            return Response({'error': 'Only jpg, jpeg, png, webp, pdf, doc and docx are allowed'}, status=status.HTTP_400_BAD_REQUEST)

        key = f'attach/{request.user.id}/{uuid.uuid4().hex}.{file_ext}'

        s3=boto3.client(
            's3',
            endpoint_url =settings.MINIO_SIGN_URL,
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_ACCESS_KEY,
            region_name='us-east-1'
        )
        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.MINIO_BUCKET,
                'Key': key,
                'ContentType': content_type,
            },
            ExpiresIn=300,
        )

        presigned_url = presigned_url.replace(
            settings.MINIO_SIGN_URL, settings.MINIO_PUBLIC_URL, 1
        )

        public_url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{key}"
        
        return Response({'presigned_url': presigned_url, 'public_url': public_url, 'content_type': content_type, 'key': key}, status=200)

class SaveAttachment(APIView):
    """
    head_object - lightweight Boto3 function. Instead of downloading the whole file, it only requests the file's metadata
    """
    def post(self, request):

        key = str(request.data.get('key', ''))
    
        if not key.startswith(f'attach/{request.user.id}/'):
            return Response({'error': 'Invalid file key'}, status=status.HTTP_403_FORBIDDEN)

        s3=boto3.client(
            's3',
            endpoint_url =settings.MINIO_SIGN_URL,
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_ACCESS_KEY,
            region_name='us-east-1'
        )
        
        try:
            head = s3.head_object(Bucket=settings.MINIO_BUCKET, Key=key)
        except ClientError:
            return Response(
                {'error': 'File not found in storage. Upload it first.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # return size and content_type
        size = head['ContentLength']
        content_type = head['ContentType']

        if content_type not in ALLOWED_TYPES:
            s3.delete_object(Bucket=settings.MINIO_BUCKET, Key=key)
            return Response({'error': 'File type not allowed'}, status=status.HTTP_400_BAD_REQUEST)

        if size > MAX_ATTACHMENT_SIZE:
            s3.delete_object(Bucket=settings.MINIO_BUCKET, Key=key)
            return Response(
                {'error': 'File too large (max 10 MB)'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                'attachment_url': f'{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{key}',
                'attachment_type': content_type,
                'attachment_size': size,
            },
            status=status.HTTP_200_OK,
        )


