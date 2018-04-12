from django.db import models

# Create your models here.

from school_app.model.models import School, Session

from student_app.models import Student

class FeeType(models.Model):
    name = models.TextField(verbose_name='name', unique=True)

    class Meta:
        db_table = 'fee_type'

class FeeDefinition(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')

    orderNumber = models.IntegerField()
    rteAllowed = models.BooleanField(null=False, default=False)

    FILTERTYPE = (
        ('CLASS', 'Class'),
        ('BUS STOP', 'Bus Stop'),
        ('BOTH', 'Both'),
        ('NONE', 'None')
    )
    filterType = models.CharField(max_length=9, choices=FILTERTYPE, null=False, default='NONE')

    FREQUENCY = (
        ('MONTHLY', 'Monthly'),
        ('QUATERLY', 'Quaterly'),
        ('ANNUALLY', 'Annually'),
    )
    frequency = models.CharField(max_length=10, choices=FREQUENCY, null=False, default='ANNUALLY')

    class Meta:
        db_table = 'fee_definition'

class SchoolFeeComponent(models.Model):
    title = models.TextField(verbose_name='title')
    amount = models.IntegerField(null=False, default=0, verbose_name='amount')
    parentFeeDefinition = models.ForeignKey(FeeDefinition, on_delete=models.PROTECT, default=0,
                                            verbose_name='parentFeeDefinition')

    class Meta:
        db_table = 'school_fee_component'

class StudentFeeComponent(models.Model):
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')
    parentSchoolFeeComponent = models.ForeignKey(SchoolFeeComponent, on_delete=models.PROTECT, default=0,
                                                 verbose_name='parentSchoolFeeComponent')
    amount = models.IntegerField(verbose_name='amount')
    bySchoolRules = models.BooleanField(null=False, default=True, verbose_name='bySchoolRules')

    remark = models.TextField()

    class Meta:
        db_table = 'student_fee_component'

class FeeReceipt(models.Model):
    receiptNumber = models.IntegerField(null=False, default=0, verbose_name='receiptNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')

    class Meta:
        db_table = 'fee_receipt'

class SubFeeReceipt(models.Model):
    parentFeeReceipt = models.ForeignKey(FeeReceipt, models.PROTECT, default=0, verbose_name='parentFeeReceipt')
    parentStudentFeeComponent = models.ForeignKey(StudentFeeComponent, models.PROTECT, default=0,
                                                  verbose_name='parentStudentFeeComponent')
    amount = models.IntegerField(null=False, default=0, verbose_name='amount')

    class Meta:
        db_table = 'sub_fee_receipt'

class Concession(models.Model):
    remark = models.TextField(verbose_name='remark')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')

    class Meta:
        db_table = 'concession_second'

class SubConcession(models.Model):
    parentConcession = models.ForeignKey(Concession, models.PROTECT, default=0, verbose_name='parentConcession')
    parentStudentFeeComponent = models.ForeignKey(StudentFeeComponent, models.PROTECT, default=0,
                                                  verbose_name='parentStudent')

    amount = models.IntegerField()

    class Meta:
        db_table = 'sub_concession'

class Month(models.Model):

    MONTH = (
        ('APRIL', 'April'),
        ('MAY', 'May'),
        ('JUNE', 'June'),
        ('JULY', 'July'),
        ('AUGUST', 'August'),
        ('SEPTEMBER', 'September'),
        ('OCTOBER', 'October'),
        ('NOVEMBER', 'November'),
        ('DECEMBER', 'December'),
        ('JANUARY', 'January'),
        ('FEBRUARY', 'February'),
        ('MARCH', 'March'),
    )
    monthName = models.CharField(max_length=10, choices=MONTH, null=False, default='APRIL')

class SchoolFeeComponentMonthly(models.Model):

    amount = models.IntegerField(null=False, default=0, verbose_name='amount')
    parentSchoolFeeComponent = models.ForeignKey(SchoolFeeComponent,
                                                 on_delete=models.PROTECT,
                                                 null=False, default=0,
                                                 verbose_name='parentStudentFeeComponent')
    parentMonth = models.ForeignKey(Month,
                                    on_delete=models.PROTECT,
                                    null=False,
                                    default=1,
                                    verbose_name='parentMonth')

    class Meta:
        db_table = 'school_fee_component_monthly'

class StudentFeeComponentMonthly(models.Model):

    amount = models.IntegerField(null=False, default=0, verbose_name='amount')
    parentStudentFeeComponent = models.ForeignKey(StudentFeeComponent,
                                                  on_delete=models.PROTECT,
                                                  null=False, default=0,
                                                  verbose_name='parentStudentFeeComponent')
    parentMonth = models.ForeignKey(Month,
                                    on_delete=models.PROTECT,
                                    null=False,
                                    default=1,
                                    verbose_name='parentMonth')

    class Meta:
        db_table = 'student_fee_component_monthly'