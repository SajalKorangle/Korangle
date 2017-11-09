from django.contrib import admin

# Register your models here.

from .models import Class, Student, Fee

admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Fee)
