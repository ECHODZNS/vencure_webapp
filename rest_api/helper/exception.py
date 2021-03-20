from rest_framework.exceptions import *
from rest_framework import status
from .message import NOT_ACCEPTABLE_REQUEST

# EXCEPTIONS
class NotAcceptable(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_details = NOT_ACCEPTABLE_REQUEST
    default_code = NOT_ACCEPTABLE_REQUEST