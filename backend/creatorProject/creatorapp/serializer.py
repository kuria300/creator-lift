import re
from rest_framework import serializers
from .models import Proposals, customUsersData, CreatorsWorks, Offers, Requests, Deals, AIConversation, AIMessage, Profiles, ProfileSpeciality
from django.contrib.auth.password_validation import validate_password

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
        # obj represents a sigle creator work, tags-represent all tags related to a creator work, select_related('tag')- represent connection to actual table offertags
        return [t.tag.name for t in obj.tags.all()]
    
class OfferSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model  = Offers
        fields = ['id', 'title','description', 'amount', 'delivery_days', 'status', 'tags']

    def get_tags(self, obj):
        return [ot.tag.name for ot in obj.tags.all()]
    
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
        return [ot.tag.name for ot in obj.tags.all()] 
    
    def get_creator_username(self, obj):
        return obj.creator.usersdata.username 

class AIMessageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = AIMessage
        fields = ['id', 'role', 'content', 'created_at']


class AIConversationSerializer(serializers.ModelSerializer):

    user_id= serializers.SerializerMethodField()
    # read-only=true this field will be ignored during validation and save operations. 
    messages= AIMessageSerializer(many=True, read_only=True)
    

    class Meta:
        model=AIConversation
        fields=['id', 'user_id','is_active', 'created_at', 'messages' ]

    def get_user_id(self, obj):
        return obj.user.id

class ProfileCreatorSerializer(serializers.ModelSerializer):

    username_profile = serializers.SerializerMethodField()
    email_profile = serializers.SerializerMethodField()
    speciality_data = serializers.SerializerMethodField()

    class Meta:
        model=Profiles
        fields=['id', 'bio','avatar_url' ,'tiktok_url', 'instagram_url', 'youtube_url', 'speciality_data','username_profile', 'email_profile']


    def get_speciality_data(self, obj):
        return [ps.speciality.speciality_name for ps in obj.specialities.select_related('speciality').all()]

    def get_username_profile(self, obj):
        return obj.usersdata.username
    
    def get_email_profile(self, obj):
        return obj.usersdata.email
    

class PasswordChangeSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(write_only=True)
    newPassword = serializers.CharField(write_only=True, min_length=8)
    confirmNewPassword = serializers.CharField(write_only=True)

    def validate_newPassword(self, value):
        # runs Django's builtin password strength rules too
        validate_password(value)
        return value

    def validate(self, data):
        if data['newPassword'] != data['confirmNewPassword']:
            raise serializers.ValidationError({"confirmNewPassword": "Passwords do not match"})

        return data
    

class BrandSerializer(serializers.ModelSerializer):
    brand_avatarUrl= serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    speciality_tags = serializers.SerializerMethodField()
    active_deals= serializers.IntegerField(read_only=True) # only accepted when serializing an existing data never accepted as input


    class Meta:
        model=customUsersData
        fields =['id', 'username', 'brand_avatarUrl','bio', 'speciality_tags', 'active_deals']

    def get_brand_avatarUrl(self, obj):
        return obj.profile.avatar_url 

    def get_bio(self, obj):
        return obj.profile.bio
    def get_speciality_tags(self, obj):
        return [ps.speciality.speciality_name for ps in obj.profile.specialities.all()]







# brands

class RequestsBrandSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    num_proposals = serializers.IntegerField(read_only=True)  # This field will be populated by the view using annotate

    class Meta:
        model = Requests
        fields = [ 'id', 'title', 'description', 'amount', 'plaform', 'deadline', 'status', 'tags', 'num_proposals']

    def get_tags(self, obj):
        return [rt.tag.name for rt in obj.tags.all()]

class ProposalsBrandSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    avatar_url= serializers.SerializerMethodField()
    title= serializers.SerializerMethodField()

    class Meta:
        model = Proposals
        fields = ['id','avatar_url','title', 'delivery_days','proposed_price', 'status', 'tags']

    def get_tags(self, obj):
        return [pt.tag.name for pt in obj.tags.all()]
    def get_avatar_url(self, obj):
        return obj.creator.avatar_url
    def get_title(self, obj):
        return obj.request.title

class ProfileBrandSerializer(serializers.ModelSerializer):
    username_profile = serializers.SerializerMethodField()
    speciality_data = serializers.SerializerMethodField()

    class Meta:
        model=Profiles
        fields=['id', 'avatar_url' , 'speciality_data','username_profile']


    def get_speciality_data(self, obj):
        return [ps.speciality.speciality_name for ps in obj.specialities.all()]

    def get_username_profile(self, obj):
        return obj.usersdata.username
    
    def get_email_profile(self, obj):
        return obj.usersdata.email
    

class DealBrandSerializer(serializers.ModelSerializer):
    brand_username= serializers.SerializerMethodField()
    title=serializers.SerializerMethodField()
    platform=serializers.SerializerMethodField()
    avatar_url= serializers.SerializerMethodField()

    class Meta:
        model=Deals
        fields=['id', 'agreed_price', 'deadline', 'status', 'brand_username', 'title', 'platform', 'avatar_url' ]

    def get_brand_username(self, obj):
        return obj.creator.username
    def get_title(self, obj):
        return obj.request.title
    def get_platform(self, obj):
        return obj.request.platform
    def get_avatar_url(self, obj):
        return obj.creator.avatar_url
  