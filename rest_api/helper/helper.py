from . import (
    exception,
    encryption,
    message,
    permission,
    mail
)

from rest_framework import status
from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response
from django.conf import settings
import requests
from random import randint
from datetime import datetime, timedelta
import os

######### CUSTOM HELPER FUNCATIONS ###############


# Custom Response
def createResponse(message='', payload={}, status_code=status.HTTP_200_OK):
    return Response({
        "detail": message,
        "payload": payload
    }, status=status_code)


# Generate JWT token for user
def get_token(user):
    return api_settings.JWT_ENCODE_HANDLER(api_settings.JWT_PAYLOAD_HANDLER(user))


# Verify Google reCaptcha
def verify_recaptcha(request):
    return True
    status = requests.post(
        settings.GOOGLE_VERIFY_RECAPTCHA_URL,
        data={
            'secret': settings.RECAPTCHA_SECRET_KEY,
            'response': request.data['g-recaptcha-response'],
        },
        verify=True
    ).json().get("success", False)

    if not status:
        raise exception.NotAcceptable(message.INVALID_RECAPTCHA)

    return status


# Check Request has valid parameters
def check_parameters(request, params):
    if not all(param in request for param in params):
        raise exception.NotAcceptable(message.NOT_VALID_PARAMS)
    return True


# Is Empty
def isEmpty(var, name):
    if not var:
        raise exception.NotAcceptable(message.INVALID_INPUT(name))
