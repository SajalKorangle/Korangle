from django.db import models
from django.contrib.auth.models import User

# Create your models here.

def get_user():
	if User.objects.filter(username='brightstar'):
		return User.objects.filter(username='brightstar')[0].id
	else:
		return 1

class Class(models.Model):
	name = models.CharField(max_length=100)
	orderNumber = models.PositiveIntegerField(default=100)
	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=get_user)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentUser.username + " --- " + self.name
		"""return self.name"""

class Student(models.Model):
	name = models.CharField(max_length=100)
	fathersName = models.CharField(max_length=100)
	mobileNumber = models.IntegerField(null=True)
	scholarNumber = models.TextField(null=True)
	totalFees = models.IntegerField(null=True)
	dateOfBirth = models.DateField(null=True)
	remark = models.TextField(null=True)
	parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

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
