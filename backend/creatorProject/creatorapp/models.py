from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import customUserManager
from django.utils.translation import gettext_lazy as _


# Create your models here.    
class customUsersData(AbstractUser):
    ROLE_CHOICES=(
        ('creator', 'Creator'),
        ('brand', 'Brand'),
        ('admin', 'Admin')
    )
    username=models.CharField(max_length=250, null=True, blank=True)
    email= models.EmailField(_('email address'),max_length=150, unique=True)
    role=models.CharField(max_length=10,choices=ROLE_CHOICES, default='creator' )
    objects= customUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'CustomUsersData={self.email}'
    