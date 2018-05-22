from django.contrib import admin

# Register your models here.

from team_app.models import Module, Task, Member, Access, Permission


admin.site.register(Module)
admin.site.register(Task)
admin.site.register(Member)
admin.site.register(Access)
admin.site.register(Permission)
