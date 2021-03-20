from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid


class MyAccountManager(BaseUserManager):
    def create_user(self, name, email, password=None):
        user = self.model(
            email=self.normalize_email(email),
            name=name
        )

        user.set_password(password)
        user.is_staff = False
        user.is_verified = True
        user.is_superuser = False
        user.save(using=self._db)
        return user


    def create_superuser(self, name, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            name=name
        )
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    otp = models.IntegerField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = MyAccountManager()

    def __str__(self):
        return self.id

    class Meta:
        db_table = 'users'
