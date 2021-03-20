from django.db import models
from django.core.files.storage import FileSystemStorage
from helper import helper
import uuid


# PRODUCT MODEL
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    banner = models.FileField(storage=FileSystemStorage(
        location=helper.settings.MEDIA_ROOT), upload_to='products')
    description = models.TextField(blank=True, null=True)
    is_visible = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
