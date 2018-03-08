from django.contrib import admin

# Register your models here.

# from .models import Class, Student, Fee, Expense, Concession, SubFee, Subject, Marks, School, SessionClass, Session
from .models import Student, Fee, Expense, Concession, SubFee, Marks, School, Session

# admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Fee)
admin.site.register(SubFee)
admin.site.register(Expense)
admin.site.register(Concession)
# admin.site.register(Subject)
admin.site.register(Marks)
admin.site.register(School)
admin.site.register(Session)
# admin.site.register(SessionClass)
