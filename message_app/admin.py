from django.contrib import admin

from .models import Class, Subject, Chapter, Question, SubQuestion, Paper, PaperElement

admin.site.register(Class)
admin.site.register(Subject)
admin.site.register(Chapter)
admin.site.register(Question)
admin.site.register(SubQuestion)
admin.site.register(Paper)
admin.site.register(PaperElement)
