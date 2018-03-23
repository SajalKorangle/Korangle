from django.db import models

from school_app.model.models import Student

from class_app.models import Section

# Create your models here.

class StudentSection(models.Model):

	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')
	parentSection = models.ForeignKey(Section, on_delete=models.PROTECT, default=0, verbose_name='parentSection')
	rollNumber = models.TextField(null=True)
	attendance = models.IntegerField(null=True)

	class Meta:
		db_table = 'student_section'
