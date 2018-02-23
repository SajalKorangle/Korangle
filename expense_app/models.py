from django.db import models
from school_app.models import School

# Create your models here.

class Expense(models.Model):

	voucherNumber = models.TextField()
	amount = models.IntegerField()
	remark = models.TextField()
	voucherDate = models.DateField(auto_now_add=True)
	parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentSchool.name + " --- " + self.remark[:50]
