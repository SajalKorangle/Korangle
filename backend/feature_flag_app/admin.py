from django.contrib import admin

# Register your models here.

from feature_flag_app.models import FeatureFlag


admin.site.register(FeatureFlag)
