from django.db import models
from .custom_model import PostgresqlModel, PostgresqlSqliteModel
class MainDbRouter:
    """
    A router to control all database operations on models in the
    auth and contenttypes applications.
    """
    route_app_labels = {'auth', 'contenttypes'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'postgresql'
        if issubclass(model, PostgresqlSqliteModel) or issubclass(model, PostgresqlModel):
            return 'postgresql'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'postgresql'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # print('app_label: ', app_label)
        # print('model_name: ', model_name)
        return True