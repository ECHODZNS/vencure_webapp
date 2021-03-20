from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from .serializers import (
    ProductSerializer,
    VendorProductSerializer
)
from rest_framework.pagination import PageNumberPagination
from .models import Product
from helper import helper


# CREATE PRODUCT
# POST
# PARAMS - name, banner, description, is_visible
# /api/product/create
class Create(CreateAPIView):
    permission_classes = [
        helper.permission.IsAdmin
    ]
    serializer_class = ProductSerializer

    def post(self, request):
        helper.check_parameters(
            request.data, ['name', 'banner', 'description', 'is_visible'])

        product = self.get_serializer(data=request.data)
        product.is_valid(raise_exception=True)
        product.save()

        return helper.createResponse(helper.message.MODULE_STORE_SUCCESS('Product'))


# READ PRODUCTS
# GET
# PARAMS - name, banner, description, is_visible
# /api/product/create
class Read(ListAPIView):
    permission_classes = [
        helper.permission.IsAuthenticated
    ]
    http_method_names = ['get']

    def list(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = helper.settings.PAGE_SIZE

        if request.user.is_superuser:
            if "search" in request.GET:
                products = Product.objects.filter(
                    name__icontains=request.GET["search"]).order_by('created').reverse()
            else:
                products = Product.objects.all().order_by('created').reverse()

            page_context = paginator.paginate_queryset(products, request)
            data = paginator.get_paginated_response(
                ProductSerializer(page_context, many=True).data
            )
        else:
            if "search" in request.GET:
                products = Product.objects.filter(
                    name__icontains=request.GET["search"], is_visible=True).order_by('created').reverse()
            else:
                products = Product.objects.filter(
                    is_visible=True).order_by('created').reverse()

            page_context = paginator.paginate_queryset(products, request)
            data = paginator.get_paginated_response(
                VendorProductSerializer(page_context, context={
                                  'request': request}, many=True).data
            )

        return data


# UPDATE PRODUCT
# PUT
# PARAMS - name, banner, description, is_visible
# /api/product/update<str:id>
class Update(UpdateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def update(self, request, id):
        helper.check_parameters(
            request.data, ['name', 'banner', 'description', 'is_visible'])

        try:
            product = Product.objects.get(id=id)
        except Exception as e:
            raise helper.exception.NotAcceptable(
                helper.message.MODULE_NOT_FOUND("product"))

        if request.data['banner']:
            try:
                product.banner.delete()
            except Exception as e:
                pass

            product.banner = request.FILES['banner']

        product.name = request.data['name']
        product.description = request.data['description']
        product.is_visible = request.data['is_visible'] in ['true', True]
        product.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Product', 'updated'))


# DELETE PRODUCT
# DELETE
# PARAMS -
# /api/product/delete<str:id>
class Delete(DestroyAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Exception as e:
            print(e)
            raise helper.exception.NotAcceptable(
                helper.message.MODULE_NOT_FOUND("product"))
        product.banner.delete()
        product.delete()
        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Product', 'deleted'))
