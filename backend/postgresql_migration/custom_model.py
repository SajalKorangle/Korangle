from django.db.models import *
from django.db import transaction

class PostgresqlSqliteModel(Model):

    def save(self, *args, **kwargs):
        with transaction.atomic():
            super().save(*args, **kwargs, using='postgresql')
            super().save(*args, **kwargs, using='default')

    class Meta:
        abstract = True

class PostgresqlModel(Model):

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs, using='postgresql')

    class Meta:
        abstract = True