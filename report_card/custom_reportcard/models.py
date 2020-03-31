from django.db import models

from school_app.model.models import School, Session
from examination_app.models import Examination
from class_app.models import Class
from grade_app.models import Grade, SubGrade
from student_app.models import Student

class Layout(models.Model):
	name = models.TextField(verbose_name='name')
	reportCardHeading = models.TextField(null = True, default='', verbose_name='reportCardHeading')
	parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')
	parentSession = models.ForeignKey(Session, on_delete=models.CASCADE, default=0, verbose_name='parentSession')
	
	showLetterHeadImage = models.BooleanField(null=False,default=False, verbose_name='showLetterHeadImage')

	attendanceStartDate = models.DateField(null=True, verbose_name='attendanceStartDate')
	attendanceEndDate = models.DateField(null=True, verbose_name='attendanceEndDate')
	decimalPlaces = models.IntegerField(null=True, default =0, verbose_name='decimalPlaces')
	# Header
	studentNameOrderNumber = models.IntegerField(null=True, default =0, verbose_name='studentNameOrderNumber')
	fatherNameOrderNumber = models.IntegerField(null=True, default =0, verbose_name='fatherNameOrderNumber')
	motherNameOrderNumber = models.IntegerField(null=True, default =0, verbose_name='motherNameOrderNumber')
	rollNoOrderNumber = models.IntegerField(null=True, default =0, verbose_name='rollNoOrderNumber')
	scholarNoOrderNumber = models.IntegerField(null=True, default =0, verbose_name='scholarNoOrderNumber')
	dateOfBirthOrderNumber = models.IntegerField(null=True, default =0, verbose_name='dateOfBirthOrderNumber')
	dateOfBirthInWordsOrderNumber = models.IntegerField(null=True, default =0, verbose_name='dateOfBirthInWordsOrderNumber')
	aadharNumberOrderNumber = models.IntegerField(null=True, default =0, verbose_name='aadharNumberOrderNumber')
	categoryOrderNumber = models.IntegerField(null=True, default =0, verbose_name='categoryOrderNumber')
	familySSMIDOrderNumber = models.IntegerField(null=True, default =0, verbose_name='familySSMIDOrderNumber')
	childSSMIDOrderNumber = models.IntegerField(null=True, default =0, verbose_name='childSSMIDOrderNumber')
	classOrderNumber = models.IntegerField(null=True, default =0, verbose_name='classOrderNumber')
	sectionOrderNumber = models.IntegerField(null=True, default =0, verbose_name='sectionOrderNumber')
	casteOrderNumber = models.IntegerField(null=True, default =0, verbose_name='casteOrderNumber')
	classAndSectionOrderNumber = models.IntegerField(null=True, default =0, verbose_name='classAndSectionOrderNumber')
	addressOrderNumber = models.IntegerField(null=True, default =0, verbose_name='addressOrderNumber')
	#Footer
	overallMarksOrderNumber = models.IntegerField(null=True, default =0, verbose_name='overallMarksOrderNumber')
	attendanceOrderNumber = models.IntegerField(null=True, default =0, verbose_name='attendanceOrderNumber')
	resultOrderNumber = models.IntegerField(null=True, default =0, verbose_name='resultOrderNumber')
	percentageOrderNumber = models.IntegerField(null=True, default =0, verbose_name='percentageOrderNumber')
	promotedToClassOrderNumber = models.IntegerField(null=True, default =0, verbose_name='promotedToClassOrderNumber')

	remarksOrderNumber = models.IntegerField(null=True, default =0, verbose_name='remarksOrderNumber')
	class Meta:
		db_table='layout'
		unique_together = ('name','parentSchool','parentSession')

class LayoutExamColumn(models.Model):
	parentLayout = models.ForeignKey(Layout, on_delete=models.CASCADE, default=0, verbose_name='parentLayout') 
	parentExamination = models.ForeignKey(Examination, on_delete=models.CASCADE, default=0, verbose_name='parentExamination')
	orderNumber = models.IntegerField(null=True, default=0)
	name = models.TextField() 
	maximumMarksObtainedOne = models.IntegerField(null=True, default=0)
	maximumMarksObtainedTwo = models.IntegerField(null=True, default=0)

	EXAM_COLUMN_TYPE = [
		('Simple','Simple'),
		('Oral/Written','Oral/Written'),
		('Practical/Theory','Practical/Theory')
	]
	columnType = models.CharField(choices=EXAM_COLUMN_TYPE, max_length=255, null=True, default='Simple')

	class Meta:
		db_table='layout_exam_column'
		unique_together=('parentLayout','parentExamination')


class LayoutGrade(models.Model):
	parentLayout = models.ForeignKey(Layout, on_delete=models.CASCADE, default=0, verbose_name='parentLayout')
	parentGrade = models.ForeignKey(Grade, on_delete=models.CASCADE, default=0, verbose_name='parentGrade')
	orderNumber = models.IntegerField(null=True, default=0)

	class Meta:
		db_table='layout_grade'
		unique_together=('parentLayout','parentGrade')

class LayoutSubGrade(models.Model):
	parentLayoutGrade = models.ForeignKey(LayoutGrade, on_delete=models.CASCADE, default=0, verbose_name='parentLayoutGrade')
	parentSubGrade = models.ForeignKey(SubGrade, on_delete=models.CASCADE, default=0, verbose_name='parentSubGrade')
	orderNumber = models.IntegerField(null=True, default=0)

	class Meta:
		db_table='layout_sub_grade'
		unique_together=('parentLayoutGrade','parentSubGrade')


class ClassLayout(models.Model):
	parentLayout = models.ForeignKey(Layout, on_delete=models.CASCADE, default=0, verbose_name='parentLayout')
	parentClass = models.ForeignKey(Class, on_delete=models.CASCADE, default=0, verbose_name='parentClass')

	class Meta:
		db_table='class_layout'
		unique_together=('parentLayout','parentClass')

class StudentRemarks(models.Model):
	parentStudent = models.ForeignKey(Student,on_delete=models.CASCADE,default=0,verbose_name='parentStudent')
	parentSession = models.ForeignKey(Session,on_delete=models.CASCADE,default=0,verbose_name='parentSession')
	remark = models.TextField(null=False, default='-', verbose_name='remark', blank=True)

	class Meta:
		db_table='student_remarks'
		unique_together=('parentStudent','parentSession')