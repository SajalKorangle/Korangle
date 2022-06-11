from django.db import models
from common.common import BasePermission
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)

    class Permissions(BasePermission):
        pass

    class Meta:
        db_table = 'auth_user'
