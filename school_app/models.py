from django.db import models

# Create your models here.

class Class(models.Model):
	name = models.CharField(max_length=100)
	orderNumber = models.PositiveIntegerField(default=100)

	def __str__(self):
		"""A string representation of the model."""
		return self.name

class Student(models.Model):
	name = models.CharField(max_length=100)
	fathersName = models.CharField(max_length=100)
	mobileNumber = models.IntegerField()
	totalFees = models.IntegerField()
	dateOfBirth = models.DateField()
	remark = models.TextField(default='---')
	parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentClass.name+" --- "+self.name

class Fee(models.Model):
	receiptNumber = models.IntegerField()
	amount = models.IntegerField()
	remark = models.TextField()
	# generationDateTime = models.DateTimeField(auto_now_add=True, blank=True)
	generationDateTime = models.DateField(auto_now_add=True)
	parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0)
