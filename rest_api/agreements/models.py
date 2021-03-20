from django.db import models
from django.core.files.storage import FileSystemStorage
from products.models import Product
from account.models import User
from helper import helper
import uuid


delivery_choices = (
    (1, 'Pickup By Manufecturer'),
    (2, 'Delivered By Vendor')
)

Agreement_Status = (
    (1, 'Waiting'),
    (2, 'Running'),
    (3, 'Counter'),
    (4, 'Ended'),
)


class Agreements(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()
    delivery = models.IntegerField(default=2)
    status = models.IntegerField(default=1)
    description = models.TextField(blank=True, null=True)
    attachment = models.FileField(storage=FileSystemStorage(
        location=helper.settings.MEDIA_ROOT), blank=True, null=True, upload_to='agreements')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "agreements"
