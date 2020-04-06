from django.contrib import admin

# Register your models here.

from team_app.models import Module, Task


admin.site.register(Module)
admin.site.register(Task)
