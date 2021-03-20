from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    CharField
)
from django.contrib.auth import authenticate
from .models import User
from helper import helper


# Admin Login serializer
class AdminLoginSerializer(Serializer):
    email = CharField()
    password = CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_superuser:
            return user
        raise helper.exception.AuthenticationFailed()


# Vendor login serializer
class VendorLoginSerializer(Serializer):
    email = CharField()
    password = CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user == None:
            raise helper.exception.AuthenticationFailed()
        elif user and user.is_active and user.is_verified:
            return user
        else:
            raise helper.exception.ParseError(helper.message.ACCOUNT_BLOCKED)


# Vendor Signup Serializer


class VendorSignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'password',
                  'is_verified', 'is_active')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, data):
        user = User.objects.create_user(**data)
        return user
