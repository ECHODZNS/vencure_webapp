from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from .serializers import (
    AgreementSerializer,
    ReadAgreementSerializer
)
from rest_framework.pagination import PageNumberPagination
from .models import Agreements
from products.models import Product
from helper import helper


# POST AGREEMENT
# POST
# PARAMS - price, start_date, end_date, delivery, description, attachment
# /api/agreement/create<str:id>
class CreateAgreement(CreateAPIView):
    permission_classes = [
        helper.permission.IsAuthenticated
    ]
    serializer_class = AgreementSerializer

    def post(self, request, id):
        helper.check_parameters(
            request.data, ['price', 'start_date', 'end_date', 'delivery', "description"])

        try:
            product = Product.objects.get(id=id)
        except Exception as e:
            raise helper.exception.NotAcceptable(
                helper.message.MODULE_NOT_FOUND("product"))

        agreement = Agreements.objects.create(
            vendor=request.user,
            product=product,
            price=request.data['price'],
            start_date=request.data['start_date'],
            end_date=request.data['end_date'],
            description=request.data['description'],
            delivery=request.data['delivery'],
        )

        if request.data['attachment']:
            agreement.attachment = request.FILES['attachment']

        agreement.save()

        return helper.createResponse(helper.message.MODULE_STORE_SUCCESS('Agreement'))


# READ AGREEMENTS
# GET
# PARAMS - &search=?&filter=?
# /api/agreement/get
class ReadAgreements(ListAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def list(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = helper.settings.PAGE_SIZE

        if request.user.is_superuser:
            if "search" in request.GET:
                if "filter" in request.GET and request.GET['filter'] != '':
                    if request.GET['filter'] == 'expiring_soon':
                        agrements = Agreements.objects.filter(
                            end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now(), product__name__icontains=request.GET['search'])
                    else:
                        agrements = Agreements.objects.filter(
                            product__name__icontains=request.GET['search'], status=request.GET['filter'])
                else:
                    agrements = Agreements.objects.filter(
                        product__name__icontains=request.GET['search'])
            else:
                if "filter" in request.GET and request.GET['filter'] != '':
                    if request.GET['filter'] == 'expiring_soon':
                        agrements = Agreements.objects.filter(
                            end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now())
                    else:
                        agrements = Agreements.objects.filter(
                            status=request.GET['filter'])
                else:
                    agrements = Agreements.objects.all()
        else:
            if "search" in request.GET:
                if "filter" in request.GET and request.GET['filter'] != '':
                    if request.GET['filter'] == 'expiring_soon':
                        agrements = Agreements.objects.filter(vendor=request.user,
                                                              end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now(), product__name__icontains=request.GET['search'])
                    else:
                        agrements = Agreements.objects.filter(vendor=request.user,
                                                              product__name__icontains=request.GET['search'], status=request.GET['filter'])
                else:
                    agrements = Agreements.objects.filter(vendor=request.user,
                                                          product__name__icontains=request.GET['search'])
            else:
                if "filter" in request.GET and request.GET['filter'] != '':
                    if request.GET['filter'] == 'expiring_soon':
                        agrements = Agreements.objects.filter(vendor=request.user,
                                                              end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now())
                    else:
                        agrements = Agreements.objects.filter(
                            vendor=request.user, status=request.GET['filter'])
                else:
                    agrements = Agreements.objects.filter(vendor=request.user)

        page_context = paginator.paginate_queryset(agrements, request)

        return paginator.get_paginated_response(
            ReadAgreementSerializer(page_context, many=True).data
        )


# READ AGREEMENTS
# GET
# PARAMS - &search=?&filter=?
# /api/agreement/readExpiringSoon
class ReadExpiringSoonAgreements(ListAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def list(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = helper.settings.PAGE_SIZE

        if request.user.is_superuser:
            agrements = Agreements.objects.filter(
                end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now())
        else:
            agrements = Agreements.objects.filter(vendor=request.user,
                                                  end_date__lte=helper.datetime.now().date()+helper.timedelta(15), end_date__gte=helper.datetime.now())

        page_context = paginator.paginate_queryset(agrements, request)

        return paginator.get_paginated_response(
            ReadAgreementSerializer(page_context, many=True).data
        )


# SET AGREEMENT TO COUNTER
# POST
# PARAMS - price
# /api/agreement/set_agreement_counter<str:id>
class SetAgreementToCounter(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def post(self, request, id):
        helper.check_parameters(request.data, ['price', 'description'])
        try:
            agreement = Agreements.objects.get(id=id)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.price = request.data['price']
        agreement.description = request.data['description']
        agreement.status = 3
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'countered'))


# UPDATE AGREEMENT COUNTER PRICE - vendor
# POST
# PARAMS -
# /api/agreement/update_agreement_counter<str:id>
class UpdateAgreementCounterPrice(CreateAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def post(self, request, id):
        helper.check_parameters(request.data, ['price'])
        try:
            agreement = Agreements.objects.get(
                vendor=request.user, id=id, status=3)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.price = request.data['price']
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'updated'))


# ACCEPT AGREEMENT
# POST
# PARAMS -
# /api/agreement/accept<str:id>
class AcceptAgreement(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def post(self, request, id):
        try:
            agreement = Agreements.objects.get(id=id)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.status = 2
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'accepted'))


# ACCEPT AGREEMENT AFTER COUNTER
# POST
# PARAMS -
# /api/agreement/accept_counter<str:id>
class AcceptAgreementCounter(CreateAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def post(self, request, id):
        print(str(request.user.id))
        try:
            agreement = Agreements.objects.get(
                vendor=request.user, id=id, status=3)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.status = 2
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'accepted'))


# REJECT AGREEMENT - ADMIN
# POST
# PARAMS -
# /api/agreement/reject_counter<str:id>
class RejectAgreement(CreateAPIView):
    permission_classes = [helper.permission.IsAdmin]

    def post(self, request, id):
        try:
            agreement = Agreements.objects.get(id=id)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.status = 4
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'rejected'))


# REJECT AGREEMENT AFTER COUNTER
# POST
# PARAMS -
# /api/agreement/reject_agreeement_counter<str:id>
class RejectAgreementCounter(CreateAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def post(self, request, id):
        try:
            agreement = Agreements.objects.get(
                vendor=request.user, id=id, status=3)
        except Exception as e:
            raise helper.exception.ParseError(
                helper.message.MODULE_NOT_FOUND('Agreement'))

        # 2 = Running/Accept
        agreement.status = 4
        agreement.save()

        return helper.createResponse(helper.message.MODULE_STATUS_CHANGE('Agreement', 'rejected'))
