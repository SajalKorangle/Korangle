from django.db import models
from django.utils.timezone import now
from school_app.model.models import School
from student_app.models import Student
from employee_app.models import Employee
from common.common import BasePermission

from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver


# Create your models here.

def upload_to(instance, filename):
    return 'schools/%s/%s_%s' % (instance.parentSchool.id, now().timestamp(), filename)


class Book(models.Model):

    parentSchool = models.ForeignKey(
        School, on_delete=models.CASCADE, default=0)

    name = models.TextField()
    author = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)

    dateOfPurchase = models.DateField(null=True)
    bookNumber = models.IntegerField()
    edition = models.TextField(null=True, blank=True)

    numberOfPages = models.IntegerField(null=True, blank=True)

    printedCost = models.DecimalField(
        null=True, blank=True, max_digits=8, decimal_places=2)

    coverType = models.TextField(null=True, blank=True)

    frontImage = models.ImageField(upload_to=upload_to, null=True, blank=True)
    backImage = models.ImageField(upload_to=upload_to, null=True, blank=True)

    typeOfBook = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)

    canStudentIssue = models.BooleanField(default=True)
    canEmployeeIssue = models.BooleanField(default=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = ['id']

    class Meta:
        db_table = 'book'
        unique_together = ('bookNumber', 'parentSchool')


class BookParameter(models.Model):

    parentSchool = models.ForeignKey(
        School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    name = models.CharField(max_length=100)

    PARAMETER_TYPE = (
        ('TEXT', 'TEXT'),
        ('FILTER', 'FILTER'),
        ('DOCUMENT', 'DOCUMENT')
    )
    parameterType = models.CharField(
        max_length=20, choices=PARAMETER_TYPE, null=False)

    filterValues = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'book_parameter'


class SchoolLibrarySettings(models.Model):

    parentSchool = models.ForeignKey(
        School, on_delete=models.CASCADE, default=0)

    # Maximum number of books that can be issued to a student at once
    maxStudentIssueCount = models.IntegerField(default=5)

    # Maximum number of books that can be issued to an employee at once
    maxEmployeeIssueCount = models.IntegerField(default=10)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'school_library_settings'


class BookIssueRecord(models.Model):

    parentBook = models.ForeignKey(
        Book, default=0, on_delete=models.CASCADE, null=True, related_name="book_issue_record")

    parentStudent = models.ForeignKey(
        Student, on_delete=models.CASCADE, null=True, default=None, related_name="book_issue_record")
    parentEmployee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, null=True, default=None, related_name="book_issue_record")

    issueTime = models.DateTimeField(auto_now_add=True)
    depositTime = models.DateTimeField(null=True, default=None)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentBook__parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'book_issue_record'


@receiver(pre_save, sender=BookIssueRecord)
def create_book_issue_record(sender, instance, **kwargs):

    if instance._state.adding:

        # Check if book is already Issued
        if(BookIssueRecord.objects.filter(parentBook=instance.parentBook, depositTime=None).exists()):
            raise Exception('Book already Issued')

        # Check if either student or employee is selected to issue to
        if(instance.parentStudent == None and instance.parentEmployee == None):
            raise Exception('No student or employee selected to Issue')

        # Check if both student and employee are not set
        if(instance.parentEmployee != None and instance.parentStudent != None):
            raise Exception('Cannot set to Student and Employee together')

        # Check if issuing is allowed
        book = instance.parentBook
        schoolSettings, _ = SchoolLibrarySettings.objects.get_or_create(
            parentSchool=book.parentSchool)
        if(instance.parentEmployee != None):
            if(not book.canEmployeeIssue):
                raise Exception('Employees cannot issue this book right now')

        else:
            if(not book.canStudentIssue):
                raise Exception('Students cannot issue this book right now')

        # Check if limit for issuing is reached or not
        if(instance.parentEmployee != None):

            alreadyIssueCount = BookIssueRecord.objects.filter(
                parentEmployee=instance.parentEmployee,
                depositTime=None
            ).count()

            if(alreadyIssueCount >= schoolSettings.maxEmployeeIssueCount):
                raise Exception('Employee has reached maximum Issue count')

        else:
            alreadyIssueCount = BookIssueRecord.objects.filter(
                parentStudent=instance.parentStudent,
                depositTime=None
            ).count()

            if(alreadyIssueCount >= schoolSettings.maxStudentIssueCount):
                raise Exception('Student has reached maximum Issue count')


@receiver(pre_delete, sender=Book)
def delete_book(sender, instance, **kwargs):

    # Do not delete book if it is issued
    if(BookIssueRecord.objects.filter(parentBook=instance, depositTime=None).exists()):
        raise Exception('Cannot delete book as it is already issued')