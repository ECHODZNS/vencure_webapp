from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Agreements


class AgreementSerializer(ModelSerializer):
    class Meta:
        model = Agreements
        fields = "__all__"


class ReadAgreementSerializer(ModelSerializer):
    vendor_id = SerializerMethodField("get_vendorId")
    vendor_name = SerializerMethodField("get_vendorName")
    vendor_email = SerializerMethodField("get_vendorEmail")
    product_id = SerializerMethodField("get_productId")
    product_name = SerializerMethodField("get_productName")
    product_banner = SerializerMethodField("get_productBanner")
    product_description = SerializerMethodField("get_productDescription")

    class Meta:
        model = Agreements
        fields = ['id', 'price', 'start_date', 'end_date',
                  'delivery', 'status', 'description', 'attachment', 'created',
                  'vendor_id', 'vendor_name', 'vendor_email', 'product_id', 'product_name',
                  'product_banner', 'product_description']
        depth = 1

    def get_vendorId(self, obj):
        return obj.vendor.id

    def get_vendorName(self, obj):
        return obj.vendor.name

    def get_vendorEmail(self, obj):
        return obj.vendor.email

    def get_productId(self, obj):
        return obj.product.id

    def get_productName(self, obj):
        return obj.product.name

    def get_productBanner(self, obj):
        return str(obj.product.banner)

    def get_productDescription(self, obj):
        return obj.product.description
