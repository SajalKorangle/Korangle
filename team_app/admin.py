from django.contrib import admin

# Register your models here.

from team_app.models import Module, Task, Access


admin.site.register(Module)
admin.site.register(Task)
admin.site.register(Access)
