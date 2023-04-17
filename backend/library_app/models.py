from django.db import models
from django.utils.timezone import now
from school_app.model.models import School
from common.common import BasePermission

# Create your models here.

def upload_to(instance, filename):
    return 'schools/%s/%s_%s' % (instance.parentSchool.id, now().timestamp(), filename)


class Book(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0)

    name = models.TextField()
    author = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)

    dateOfPurchase = models.DateField(null=True)
    bookNumber = models.IntegerField(unique=True)
    edition = models.TextField(null=True, blank=True)

    numberOfPages = models.IntegerField(null=True, blank=True)

    printedCost = models.DecimalField(null=True, blank=True, max_digits=8, decimal_places=2)

    coverType = models.TextField(null=True, blank=True)

    frontImage = models.ImageField(upload_to=upload_to, null=True, blank=True)
    backImage = models.ImageField(upload_to=upload_to, null=True, blank=True)

    typeOfBook = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = ['id']

    class Meta:
        db_table = 'book'


class BookParameter(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    name = models.CharField(max_length=100)

    PARAMETER_TYPE = (
        ( 'TEXT', 'TEXT' ),
        ( 'FILTER', 'FILTER' ),
        ( 'DOCUMENT','DOCUMENT')
    )
    parameterType = models.CharField(max_length=20, choices=PARAMETER_TYPE, null=False)

    filterValues = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'book_parameter'


