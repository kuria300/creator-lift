import re
from rest_framework import serializers
from .models import customUsersData

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






        
  