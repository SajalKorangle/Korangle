from django.contrib import admin

# Register your models here.

from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

admin.site.register(Student)
admin.site.register(Fee)
admin.site.register(SubFee)
admin.site.register(Concession)
admin.site.register(School)
admin.site.register(Session)
