from django.db import models

from school_app.model.models import School, Session
from examination_app.model.models import Examination



class Layout(models.Model):
	name = models.TextField(verbose_name='name')
	showLetterHead = models.ImageField(null=True)
	parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
	parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
	showAttendanceStartDate = models.IntegerField(null=True, default =0, verbose_name='showAttendanceStartDate')
	showAttendanceEndDate = models.IntegerField(null=True, default =0,verbose_name='showAttendanceEndDate')
	# Header
	showStudentName = models.IntegerField(null=True, default =0, verbose_name='showStudentName')
	showFatherName = models.IntegerField(null=True, default =0, verbose_name='showFatherName')
	showMotherName = models.IntegerField(null=True, default =0, verbose_name='showMotherName')
	showRollNo = models.IntegerField(null=True, default =0, verbose_name='showRollNo')
	showScholarNo = models.IntegerField(null=True, default =0, verbose_name='showScholarNo')
	showDateOfBirth = models.IntegerField(null=True, default =0, verbose_name='showDateOfBirth')
	showDateOfBirthInWords = models.IntegerField(null=True, default =0, verbose_name='showDateOfBirthInWords')
	showAadharNumber = models.IntegerField(null=True, default =0, verbose_name='showAadharNumber')
	showCategory = models.IntegerField(null=True, default =0, verbose_name='showCategory')
	showFamilySSMID = models.IntegerField(null=True, default =0, verbose_name='showFamilySSMID')
	showChildSSMID = models.IntegerField(null=True, default =0, verbose_name='showChildSSMID')
	showClass = models.IntegerField(null=True, default =0, verbose_name='showClass')
	showSection = models.IntegerField(null=True, default =0, verbose_name='showSection')
	showCaste = models.IntegerField(null=True, default =0, verbose_name='showCaste')
	#Footer
	showRemarks = models.IntegerField(null=True, default =0, verbose_name='showRemarks')
	showOverallMarks = models.IntegerField(null=True, default =0, verbose_name='showOverallMarks')
	showAttendance = models.IntegerField(null=True, default =0, verbose_name='showAttendance')
	showResult = models.IntegerField(null=True, default =0, verbose_name='showResult')
	showPercentage = models.IntegerField(null=True, default =0, verbose_name='showPercentage')
	showAttendance = models.IntegerField(null=True, default =0, verbose_name='showAttendance')
	showPromotedToClass = models.IntegerField(null=True, default =0, verbose_name='showPromotedToClass')

	class Meta:
		db_table='layout'
		unique_together = ('name','parentSchool','parentSession')

class LayoutExamColumn(models.Model):
	parentLayout = models.ForeignKey(Layout, on_delete=models.PROTECT, default=0, verbose_name='parentLayout') 
	parentExamination = models.ForeignKey(Examination, on_delete=models.PROTECT, default=0, verbose_name='parentExamination')
	orderNumber = models.IntegerField(null=True, default=0)
	name = models.TextField() 
	maximumMarksObtainedOne = models.Integer(null=True, default=0)
	maximumMarksObtainedTwo = models.Integer(null=True, default=0)

	EXAM_COLUMN_TYPE = (
		(‘Simple’,  ‘Simple’),
		(‘Oral/Written’, ‘Oral/Written’),
		(‘Practical/Theory’, ‘Practical/Theory’)
	)
	columnType = models.CharField(choices=EXAM_COLUMN_TYPE, max_length=255, null=True, default='Simple')

	class Meta:
		db_table='layout_exam_column'
		unique_together=('parentLayout','parentExamination')

