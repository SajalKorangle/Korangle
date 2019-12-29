from django.contrib import admin
from .models import ClassTeacherSignature, Class, Division
# Register your models here.
admin.site.register(ClassTeacherSignature)
admin.site.register(Class)
admin.site.register(Division)