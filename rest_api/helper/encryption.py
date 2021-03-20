import jwt
from django.conf import settings

def decrypt(encoded_jwt):
    return jwt.decode(encoded_jwt, settings.JWT_SECRET, algorithms=['HS256'])

def encrypt(raw_array):
    return jwt.encode(raw_array, settings.JWT_SECRET, algorithm='HS256').decode("utf-8")