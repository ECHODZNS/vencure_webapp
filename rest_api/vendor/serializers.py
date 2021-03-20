from rest_framework.serializers import ModelSerializer
from account.models import User


class VendorSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email',
                  'date_joined', 'last_login', 'is_active', 'is_verified']
