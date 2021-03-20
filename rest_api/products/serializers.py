from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Product
from agreements.models import Agreements


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class VendorProductSerializer(ModelSerializer):
    vendor_status = SerializerMethodField('get_vendorStatus')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'is_visible',
                  'created', 'banner', 'vendor_status']

    def get_vendorStatus(self, obj):
        request = self.context['request']

        agreements = Agreements.objects.filter(
            product_id=str(obj.id), vendor=request.user).count()

        if agreements > 0:
            return True
        else:
            return False
