from django.urls import path
from .api import (
    AdminLogin,
    VendorLogin,
    UpdatePassword
)


urlpatterns = [
    path('adminLogin', AdminLogin.as_view()),
    path('vendorLogin', VendorLogin.as_view()),
    path('updatePassword', UpdatePassword.as_view()),
]
