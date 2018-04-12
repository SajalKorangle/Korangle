from django.db import models

# Create your models here.

from student_app.models import Student

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
        return self.parentStudent.className
        '''return self.parentStudent.get_class_name(get_session_object(self.generationDateTime))'''

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
        return self.parentStudent.className
        '''return self.parentStudent.get_class_name(get_session_object(self.generationDateTime))'''

    class Meta:
        db_table = 'concession'

