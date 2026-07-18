import re
from rest_framework import serializers
from .models import customUsersData, CreatorsWorks, Offers, Requests, Deals

class Userserializer(serializers.ModelSerializer):
    class Meta:
        model= customUsersData
        fields=('id', 'email','username','role','password')
        extra_kwargs={
            'password': {'write_only': True}
        }


    def validate_password(self, value):
        if len(value) < 4:
            raise serializers.ValidationError(
                "Password must be at least 4 characters long"
            )
        return value

    def validate_username(self, value):
        pattern = r'^[a-zA-Z][a-zA-Z0-9_]{4,14}$'

        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError(
                "Username must start with a letter and be 5–15 characters long. "
            )
        return value


    def create(self,validated_data):
        # when serializer.save() is called this method will be called
        user=customUsersData.objects.create_user(**validated_data)
        return user
    
class Goggleserializer(serializers.ModelSerializer):
    class Meta:
        model = customUsersData
        fields = ("id", "email", "username", "role")
        read_only_fields = ('id',)

    def validate_username(self, value):
        pattern = r'^[a-zA-Z][a-zA-Z0-9_]{4,14}$'

        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError(
                "Username must start with a letter and be 5–15 characters long. "
            )
        return value 
    def create(self, validated_data):
        return customUsersData.objects.create_user(**validated_data)

class CreatorWorkSerializer(serializers.ModelSerializer):
    tags= serializers.SerializerMethodField()

    class Meta:
        model = CreatorsWorks
        fields = ['id', 'title', 'description', 'platform', 'thumbnail_url', 'tags']

    def get_tags(self, obj):
        # perfoms sql join to get also tags object  so i can access name at same time no tag_id only then fetch name time consuming (select_related)
        return [t.tag.name for t in obj.tags.select_related('tag').all()]
    
class OfferSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model  = Offers
        fields = ['id', 'title','description', 'amount', 'delivery_days', 'status', 'tags']

    def get_tags(self, obj):
        return [ot.tag.name for ot in obj.tags.select_related('tag').all()]
    
class RequestSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()

    class Meta:
        model= Requests
        fields = ['id', 'title', 'description', 'amount', 'platform', 'deadline', 'status', 'tags', 'brand']

    def get_tags(self, obj):
        return [ rt.tag.name for rt in obj.tags.select_related('tag').all()]

    def get_brand(self, obj):
        return obj.brand.username
        

class DealSerializer(serializers.ModelSerializer):
    brand= serializers.SerializerMethodField()
    title=serializers.SerializerMethodField()
    description=serializers.SerializerMethodField()
    platform=serializers.SerializerMethodField()

    class Meta:
        model=Deals
        fields=['id', 'agreed_price', 'deadline', 'status', 'brand', 'title', 'description', 'platform' ]

    #  obj is one single Deal instance Django passes each row to the serializer one at a time when many=True.
    # brand comes from one deal. brand the FK then usermane to get username from customuserdata
    def get_brand(self, obj):
        return obj.brand.username
    def get_title(self, obj):
        return obj.request.title
    def get_description(self, obj):
        return obj.request.description
    def get_platform(self, obj):
        return obj.request.platform
    

class CreatorOfferSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    creator_username= serializers.SerializerMethodField()

    class Meta:
        model=Offers
        fields =['id', 'title', 'description', 'amount', 'delivery_days', 'status', 'image_url', 'tags', 'creator_username']

    def get_tags(self, obj):
        return [ot.tag.name for ot in obj.tags.select_related('tag').all()] 
    
    def get_creator_username(self, obj):
        return obj.creator.usersdata.username 









        
  