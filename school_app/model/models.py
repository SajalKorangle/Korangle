from django.db import models
from django.contrib.auth.models import User

from school_app.model_custom_field import CustomImageField

from django.core.exceptions import ObjectDoesNotExist

class Session(models.Model):

	startDate = models.DateField()
	endDate = models.DateField()
	name = models.TextField(default='',null=True)
	orderNumber = models.IntegerField(default=0)

	def __str__(self):
		return str(self.startDate) + ' --- ' + str(self.endDate)

	class Meta:
		db_table = 'session'

def get_user():
	if User.objects.filter(username='brightstar'):
		return User.objects.filter(username='brightstar')[0].id
	else:
		return 1

from school_app.session import get_current_session_object, get_session_object

class Student(models.Model):

	name = models.CharField(max_length=100)
	fathersName = models.CharField(max_length=100)
	mobileNumber = models.IntegerField(null=True)
	# rollNumber = models.TextField(null=True)
	scholarNumber = models.TextField(null=True)
	totalFees = models.IntegerField(default=0)
	dateOfBirth = models.DateField(null=True)
	remark = models.TextField(null=True)

	# friendSection = models.ManyToManyField('class_app.Section')

	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0)

	# new student profile data
	motherName = models.TextField(null=True)
	gender = models.TextField(null=True)
	caste = models.TextField(null=True)

	CATEGORY = (
		( 'SC', 'Scheduled Caste' ),
		( 'ST', 'Scheduled Tribe' ),
		( 'OBC', 'Other Backward Classes' ),
		( 'Gen.', 'General' ),
	)
	newCategoryField = models.CharField(max_length=5, choices=CATEGORY, null=True)

	RELIGION = (
		( 'Hinduism', 'Hinduism' ),
		( 'Islam', 'Islam' ),
		( 'Christianity', 'Christianity' ),
		( 'Jainism', 'Jainism' ),
	)
	newReligionField = models.CharField(max_length=20, choices=RELIGION, null=True)

	fatherOccupation = models.TextField(null=True)
	address = models.TextField(null=True)
	familySSMID = models.IntegerField(null=True)
	childSSMID = models.IntegerField(null=True)
	bankName = models.TextField(null=True)
	bankAccountNum = models.TextField(null=True)
	aadharNum = models.IntegerField(null=True)
	bloodGroup = models.TextField(null=True)
	fatherAnnualIncome = models.TextField(null=True)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentUser.username+" --- "+self.name

	@property
	def currentRollNumber(self):
		return self.studentsection_set\
			.get(parentSection__parentClassSession__parentSession=get_current_session_object()).rollNumber

	def get_section_id(self, session_object):
		return self.studentsection_set\
			.get(parentSection__parentClassSession__parentSession=session_object).parentSection.id

	def get_section_name(self, session_object):
		return self.studentsection_set\
			.get(parentSection__parentClassSession__parentSession=session_object).parentSection.name

	def get_class_id(self, session_object):
		return self.studentsection_set\
			.get(parentSection__parentClassSession__parentSession=session_object).parentSection.parentClassSession.parentClass.id

	def get_class_name(self, session_object):
		return self.studentsection_set\
			.get(parentSection__parentClassSession__parentSession=session_object).parentSection.parentClassSession.parentClass.name

	@property
	def school(self):
		return self.parentUser.school_set.filter()[0]

	class Meta:
		db_table = 'student'

class Fee(models.Model):

	receiptNumber = models.IntegerField()
	amount = models.IntegerField()
	remark = models.TextField()
	generationDateTime = models.DateField()
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)

	@property
	def studentName(self):
		return self.parentStudent.name

	@property
	def className(self):
		return self.parentStudent.get_class_name(get_session_object(self.generationDateTime))

	class Meta:
		db_table = 'fee'

class SubFee(models.Model):

	particular = models.TextField() # TutionFee, LateFee, CautionMoney
	amount = models.IntegerField(default=0)
	parentFee = models.ForeignKey(Fee, on_delete=models.PROTECT, default=0)

	class Meta:
		db_table = 'sub_fee'

class Concession(models.Model):

	amount = models.IntegerField()
	remark = models.TextField()
	# generationDateTime = models.DateTimeField(auto_now_add=True, blank=True)
	generationDateTime = models.DateField(auto_now_add=True)
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)

	@property
	def studentName(self):
		return self.parentStudent.name

	@property
	def className(self):
		return self.parentStudent.get_class_name(get_session_object(self.generationDateTime))

	class Meta:
		db_table = 'concession'

class School(models.Model):

	user = models.ManyToManyField(User)
	name = models.TextField(null=True)
	printName = models.TextField(null=True)
	logo = CustomImageField(use_key=True, upload_to='tmp')
	primaryThemeColor = models.TextField(null=True)
	secondaryThemeColor = models.TextField(null=True)
	complexFeeStructure = models.BooleanField(default=True)
	address = models.TextField(null=True)
	diseCode = models.TextField(null=True)

	def get_upload_to(self, attname):
			return 'school/id/{0}'.format(self.id)

	def workingDays(self, session_object):
		try:
			return SchoolSession.objects.get(parentSchool=self, parentSession=session_object).workingDays
		except ObjectDoesNotExist:
			return None

	def __str__(self):
		return self.printName

	class Meta:
		db_table = 'school'

class SchoolSession(models.Model):

	parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession')
	parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
	workingDays = models.IntegerField(default=0)

	def __str__(self):
		return self.parentSession.name + ' --- ' + self.parentSchool.name + ' --- ' + str(self.workingDays)

	class Meta:
		db_table = 'school_session'
		unique_together = ( 'parentSession', 'parentSchool' )
