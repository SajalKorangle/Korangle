from django.contrib import admin

# Register your models here.

from .models import Class, Student, Fee, Expense, Concession, SubFee, Subject, Marks

admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Fee)
admin.site.register(SubFee)
admin.site.register(Expense)
admin.site.register(Concession)
admin.site.register(Subject)
admin.site.register(Marks)
