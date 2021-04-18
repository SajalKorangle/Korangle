from django.contrib import admin

# Register your models here.

from feature_app.models import Feature

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('title_link', 'status', 'remark')
    list_filter = ('status',)

    def title_link(self, obj):
        return str(obj.parentUser.username) + ' - ' + obj.title

    def remark(self, obj):
        return obj.productManagerRemark

