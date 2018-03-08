from django.db import models
from django.contrib.auth.models import User

from .model_custom_field import CustomImageField

class Session(models.Model):
	startDate = models.DateField()
	endDate = models.DateField()
	name = models.TextField(default='',null=True)

	def __str__(self):
		return str(self.startDate) + ' --- ' + str(self.endDate)


from class_app.models import Section

def get_user():
	if User.objects.filter(username='brightstar'):
		return User.objects.filter(username='brightstar')[0].id
	else:
		return 1

'''class Class(models.Model):
	name = models.CharField(max_length=100)
	orderNumber = models.PositiveIntegerField(default=100)
	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=get_user)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentUser.username + " --- " + self.name
		"""return self.name"""'''

class Subject(models.Model):
	name = models.TextField(default='')
	# parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return self.name

class Student(models.Model):
	name = models.CharField(max_length=100)
	fathersName = models.CharField(max_length=100)
	mobileNumber = models.IntegerField(null=True)
	rollNumber = models.TextField(null=True)
	scholarNumber = models.TextField(null=True)
	totalFees = models.IntegerField(default=0)
	dateOfBirth = models.DateField(null=True)
	remark = models.TextField(null=True)

	# parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0) # deprecated on 9th 2018

	# sessionClass = models.ManyToManyField('SessionClass')

	friendSection = models.ManyToManyField('class_app.Section')

	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0)

	# new student profile data
	motherName = models.TextField(null=True)
	gender = models.TextField(null=True)
	caste = models.TextField(null=True)

	# category = models.TextField(null=True) # deprecated on 8th Feb 2018

	CATEGORY = (
		( 'SC', 'Scheduled Caste' ),
		( 'ST', 'Scheduled Tribe' ),
		( 'OBC', 'Other Backward Classes' ),
		( 'Gen.', 'General' ),
	)
	newCategoryField = models.CharField(max_length=5, choices=CATEGORY, null=True)

	# religion = models.TextField(null=True) # deprecated on 8th Feb 2018

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
		return self.parentClass.name+" --- "+self.name

class Fee(models.Model):
	receiptNumber = models.IntegerField()
	amount = models.IntegerField()
	remark = models.TextField()
	# generationDateTime = models.DateTimeField(auto_now_add=True, blank=True)
	generationDateTime = models.DateField()
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)

class SubFee(models.Model):
	particular = models.TextField() # TutionFee, LateFee, CautionMoney
	amount = models.IntegerField(default=0)
	parentFee = models.ForeignKey(Fee, on_delete=models.PROTECT, default=0)

class Concession(models.Model):
	amount = models.IntegerField()
	remark = models.TextField()
	# generationDateTime = models.DateTimeField(auto_now_add=True, blank=True)
	generationDateTime = models.DateField(auto_now_add=True)
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)

class Expense(models.Model):
	voucherNumber = models.IntegerField()
	amount = models.IntegerField()
	remark = models.TextField()
	# generationDateTime = models.DateTimeField(auto_now_add=True, blank=True)
	generationDateTime = models.DateField(auto_now_add=True)
	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=get_user)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentUser.username + " --- " + self.remark[:50]

class Marks(models.Model):
	marks = models.DecimalField(decimal_places=2,max_digits=10,default=0)
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)
	parentSubject = models.ForeignKey(Subject, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return self.parentStudent.name + " --- " + self.parentSubject.name + " --- " + str(self.marks)

class School(models.Model):
	user = models.ManyToManyField(User)
	name = models.TextField(null=True)
	printName = models.TextField(null=True)
	logo = CustomImageField(use_key=True, upload_to='tmp')
	primaryThemeColor = models.TextField(null=True)
	secondaryThemeColor = models.TextField(null=True)
	complexFeeStructure = models.BooleanField(default=True)

	def get_upload_to(self, attname):
			return 'school/id/{0}'.format(self.id)

	def __str__(self):
		return self.printName

'''class SessionClass(models.Model):
	parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0)
	parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return str(self.parentSession.startDate) + ' --- ' + str(self.parentSession.endDate) + ' --- ' + self.parentClass.name'''

