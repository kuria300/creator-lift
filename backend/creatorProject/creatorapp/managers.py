from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class customUserManager(BaseUserManager):
    def create_user(self, email,role, password =None, username=None, **extra_fields):
        if not email:
            raise ValueError(_('Email is required!'))
        if not role:
            raise ValueError(_('role is required!'))
        email= self.normalize_email(email)
        user = self.model(email=email, role=role, username=username,**extra_fields)
        if password:
            user.set_password(password)
        else:
             user.set_unusable_password() # allow now oauth only no passwrd login 
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email,password, username=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password,username,role, **extra_fields)
