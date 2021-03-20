from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.pagination import PageNumberPagination
from account.serializers import VendorSignupSerializer, User
from agreements.models import Agreements
from products.models import Product
from .serializers import VendorSerializer
from helper import helper


# Create vendor
# post
# params - name, email, password
# /api/vendor/createVendor
class CreateVendor(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]
    serializer_class = VendorSignupSerializer

    def post(self, request):
        helper.check_parameters(request.data, ['name', 'email', 'password'])

        if User.objects.filter(email=request.data['email']).count() > 0:
            raise helper.exception.NotAcceptable(
                helper.message.USER_EMAIL_EXISTS)

        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        user.save()

        return helper.createResponse(helper.message.VENDOR_CREATED)


# Create vendor
# post
# params - name, email, password
# /api/vendor/update_password
class UpdateVendorPassword(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def post(self, request, id):
        helper.check_parameters(request.data, ['password'])

        try:
            user = User.objects.get(id=id, is_superuser=False)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('User'))

        user.set_password(request.data['password'])
        user.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Vendor password', 'updated'))


# Read vendor
# get
# params - ?search=
# /api/vendor/read
class ReadVendors(ListAPIView):
    permission_classes = [helper.permission.IsAdmin]
    http_method_names = ['get']

    def list(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = helper.settings.PAGE_SIZE

        if "search" in request.GET:
            vendors = User.objects.filter(
                email__icontains=request.GET["search"], is_superuser=False
            ).order_by('date_joined').reverse()
        else:
            vendors = User.objects.filter(is_superuser=False).order_by(
                'date_joined').reverse()

        page_context = paginator.paginate_queryset(vendors, request)

        return paginator.get_paginated_response(
            VendorSerializer(page_context, many=True).data
        )


# Deactivate / Activate vendor
# post
# params - status
# /api/vendor/read
class VendorStatus(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def post(self, request, id):
        helper.check_parameters(request.data, ['status'])

        try:
            user = User.objects.get(id=id, is_superuser=False)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('User'))

        user.is_verified = request.data['status'] in ['true', 1]
        user.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Vendor status', 'updated'))


# ADMIN DASHBOARD
# GET
# params -
# /api/vendor/adminDashboard
class AdminDashboard(ListAPIView):
    permission_classes = [helper.permission.IsAdmin]
    http_method_names = ['get']

    def list(self, request):
        # Products
        live_products = Product.objects.filter(is_visible=True).count()
        offline_products = Product.objects.filter(is_visible=False).count()
        products = Product.objects.filter().count()

        # Agreements
        running_agreements = Agreements.objects.filter(status=2).count()
        expiring_agreements = Agreements.objects.filter(
            end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now(), status=2).count()
        counter_agreements = Agreements.objects.filter(status=3).count()
        agreements = Agreements.objects.filter().count()

        # vendors
        vendors = User.objects.filter(is_superuser=False).count()

        return helper.createResponse(
            helper.message.MODULE_LIST('Dashboard'),
            {
                "live_products": live_products,
                "offline_products": offline_products,
                "products": products,
                "running_agreements": running_agreements,
                "expiring_agreements": expiring_agreements,
                "counter_agreements": counter_agreements,
                "agreements": agreements,
                "vendors": vendors
            }
        )


# VENDOR DASHBOARD
# GET
# params -
# /api/vendor/vendorDashboard
class VendorDashboard(ListAPIView):
    permission_classes = [helper.permission.IsAuthenticated]
    http_method_names = ['get']

    def list(self, request):
        running_agreements = Agreements.objects.filter(
            vendor=request.user, status=2).count()
        expiring_agreements = Agreements.objects.filter(vendor=request.user,
                                                        end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now(), status=2).count()
        counter_agreements = Agreements.objects.filter(
            vendor=request.user, status=3).count()
        agreements = Agreements.objects.filter(vendor=request.user).count()

        return helper.createResponse(
            helper.message.MODULE_LIST('Dashboard'),
            {
                "running_agreements": running_agreements,
                "expiring_agreements": expiring_agreements,
                "counter_agreements": counter_agreements,
                "agreements": agreements
            }
        )
