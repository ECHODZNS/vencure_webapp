from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView
)
from .serializers import (
    AdminLoginSerializer,
    VendorLoginSerializer,
    VendorSignupSerializer,
    authenticate
)
from .models import User
from helper import helper


# Admin Login API
# post
# params - email, password
# /api/account/adminLogin
class AdminLogin(GenericAPIView):
    serializer_class = AdminLoginSerializer

    def post(self, request):
        helper.check_parameters(request.data, ['email', 'password'])
        helper.verify_recaptcha(request)

        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        user = user.validated_data

        return helper.createResponse(
            helper.message.LOGIN_SUCCESS,
            {
                "user": user.name,
                "token": helper.get_token(user)
            }
        )


# Vendor Login API
# post
# params - email, password
# /api/account/vendorLogin
class VendorLogin(GenericAPIView):
    serializer_class = VendorLoginSerializer

    def post(self, request):
        helper.check_parameters(request.data, ['email', 'password'])
        helper.verify_recaptcha(request)

        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        user = user.validated_data

        return helper.createResponse(
            helper.message.LOGIN_SUCCESS,
            {
                "user": user.name,
                "token": helper.get_token(user)
            }
        )


# Update Password API
# post
# params - old_password, new_password
# /api/account/vendorLogin
class UpdatePassword(CreateAPIView):
    permission_classes = [helper.permission.IsAuthenticated]

    def post(self, request):
        helper.check_parameters(request.data, ["old_password", "new_password"])
        helper.isEmpty(request.data["old_password"], "old_password")

        user = authenticate(
            **{
                "email": request.user.email,
                "password": request.data["old_password"],
            }
        )

        if user != None:
            user.set_password(request.data["new_password"])
            user.save()
            return helper.createResponse(helper.message.CHANGE_PASSWORD_SUCCESS)
        else:
            raise helper.exception.ParseError(helper.message.PASSWORD_MISMATCH)
