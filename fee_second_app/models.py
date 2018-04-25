from django.db import models

from django.db.models import Sum

from django.core.exceptions import ObjectDoesNotExist

# Create your models here.

from school_app.model.models import School, Session, BusStop

from student_app.models import Student

from class_app.models import Class


class Month(models.Model):

    APRIL = 'APRIL'
    MAY = 'MAY'
    JUNE = 'JUNE'
    JULY = 'JULY'
    AUGUST = 'AUGUST'
    SEPTEMBER = 'SEPTEMBER'
    OCTOBER = 'OCTOBER'
    NOVEMBER = 'NOVEMBER'
    DECEMBER = 'DECEMBER'
    JANUARY = 'JANUARY'
    FEBRUARY = 'FEBRUARY'
    MARCH = 'MARCH'
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
    name = models.CharField(max_length=10, choices=MONTH, null=False, default=APRIL)

class FeeType(models.Model):
    name = models.TextField(verbose_name='name', unique=True)

    class Meta:
        db_table = 'fee_type'


##### School Rules #####
class FeeDefinition(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')

    orderNumber = models.IntegerField()
    rteAllowed = models.BooleanField(null=False, default=False)

    CLASS_BASED_FILTER = 'CLASS'
    BUS_STOP_BASED_FILTER = 'BUS STOP'
    CLASS_BUS_STOP_BASED_FILTER = 'BOTH'
    NO_FILTER = 'NONE'
    FILTERTYPE = (
        (CLASS_BASED_FILTER, 'Class'),
        (BUS_STOP_BASED_FILTER, 'Bus Stop'),
        (CLASS_BUS_STOP_BASED_FILTER, 'Both'),
        (NO_FILTER, 'None')
    )
    filterType = models.CharField(max_length=9, choices=FILTERTYPE, null=False, default=NO_FILTER)

    MONTHLY_FREQUENCY = 'MONTHLY'
    QUATERLY_FREQUENCY = 'QUATERLY'
    ANNUALLY_FREQUENCY = 'ANNUALLY'
    FREQUENCY = (
        (MONTHLY_FREQUENCY, 'Monthly'),
        (QUATERLY_FREQUENCY, 'Quaterly'),
        (ANNUALLY_FREQUENCY, 'Annually'),
    )
    frequency = models.CharField(max_length=10, choices=FREQUENCY, null=False, default=ANNUALLY_FREQUENCY)

    class Meta:
        db_table = 'fee_definition'

class SchoolFeeComponent(models.Model):
    title = models.TextField(verbose_name='title')
    amount = models.IntegerField(null=False, default=0, verbose_name='amount')
    parentFeeDefinition = models.ForeignKey(FeeDefinition, on_delete=models.PROTECT, default=0,
                                            verbose_name='parentFeeDefinition')

    class Meta:
        db_table = 'school_fee_component'

class SchoolMonthlyFeeComponent(models.Model):

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

class ClassBasedFilter(models.Model):
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, default=0)
    parentSchoolFeeComponent = models.ForeignKey(SchoolFeeComponent, on_delete=models.PROTECT, null=False, default=0)

    class Meta:
        db_table = 'class_based_filter'

class BusStopBasedFilter(models.Model):
    parentBusStop = models.ForeignKey(BusStop, on_delete=models.PROTECT, null=False, default=0)
    parentSchoolFeeComponent = models.ForeignKey(SchoolFeeComponent, on_delete=models.PROTECT, null=False, default=0)

    class Meta:
        db_table = 'bus_stop_based_filter'


##### Student Fees #####
class StudentFeeComponent(models.Model):
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')
    parentFeeDefinition = models.ForeignKey(FeeDefinition, on_delete=models.PROTECT, default=0,
                                            verbose_name='parentFeeDefinition')
    amount = models.IntegerField(verbose_name='amount')
    bySchoolRules = models.BooleanField(null=False, default=True, verbose_name='bySchoolRules')

    remark = models.TextField()

    @property
    def schoolFeeComponent(self):
        session_object = self.parentFeeDefinition.parentSession
        if self.parentFeeDefinition.filterType == FeeDefinition.CLASS_BASED_FILTER:
            class_object = self.parentStudent.get_class_object(session_object)
            try:
                schoolFeeComponent_object = ClassBasedFilter.objects.get(
                    parentClass=class_object,
                    parentSchoolFeeComponent__parentFeeDefinition=self.parentFeeDefinition).parentSchoolFeeComponent
                return schoolFeeComponent_object
            except ObjectDoesNotExist:
                return None
        elif self.parentFeeDefinition.filterType == FeeDefinition.BUS_STOP_BASED_FILTER:
            busStop_object = self.parentStudent.currentBusStop
            try:
                schoolFeeComponent_object = BusStopBasedFilter.objects.get(
                    parentBusStop=busStop_object,
                    parentSchoolFeeComponent__parentFeeDefinition=self.parentFeeDefinition).parentSchoolFeeComponent
                return schoolFeeComponent_object
            except ObjectDoesNotExist:
                return None
        elif self.parentFeeDefinition.filterType == FeeDefinition.CLASS_BUS_STOP_BASED_FILTER:
            class_object = self.parentStudent.get_class_object(session_object)
            busStop_object = self.parentStudent.currentBusStop
            for schoolFeeComponent_object in SchoolFeeComponent.objects.filter(parentFeeDefinition=self.parentFeeDefinition):
                if schoolFeeComponent_object.classbasedfee_set.filter(parentClass=class_object).count() == 1 \
                        & schoolFeeComponent_object.busstopbasedfee_set.filter(parentBusStop=busStop_object).count() == 1:
                    return schoolFeeComponent_object
            return None
        elif self.parentFeeDefinition.filterType == FeeDefinition.NO_FILTER:
            return SchoolFeeComponent.objects.get(parentFeeDefinition=self.parentFeeDefinition)
        return None

    @property
    def schoolAmount(self):
        if self.schoolFeeComponent is None:
            return None
        else:
            return self.schoolFeeComponent.amount

    @property
    def amountDue(self):
        amountPaid = SubFeeReceipt.objects.filter(parentStudentFeeComponent=self).aggregate(Sum('amount'))['amount__sum']
        if amountPaid is None:
            amountPaid = 0
        amountExempted = SubConcession.objects.filter(parentStudentFeeComponent=self).aggregate(Sum('amount'))['amount__sum']
        if amountExempted is None:
            amountExempted = 0
        return self.amount-amountPaid-amountExempted

    class Meta:
        db_table = 'student_fee_component'

class StudentMonthlyFeeComponent(models.Model):
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

    @property
    def schoolAmount(self):
        schoolFeeComponent = self.parentStudentFeeComponent.schoolFeeComponent
        if schoolFeeComponent is None:
            return None
        else:
            return SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=schoolFeeComponent,
                                                         parentMonth=self.parentMonth).amount

    @property
    def amountDue(self):
        amountPaid = SubFeeReceiptMonthly.objects.filter(
            parentSubFeeReceipt__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountPaid is None:
            amountPaid = 0
        amountExempted = SubConcessionMonthly.objects.filter(
            parentSubConcession__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountExempted is None:
            amountExempted = 0
        return self.amount-amountPaid-amountExempted

    class Meta:
        db_table = 'student_fee_component_monthly'


##### Receipts #######
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

class SubFeeReceiptMonthly(models.Model):
    parentSubFeeReceipt = models.ForeignKey(SubFeeReceipt, models.PROTECT, default=0, verbose_name='parentSubFeeReceipt')
    parentMonth = models.ForeignKey(Month,
                                    on_delete=models.PROTECT,
                                    null=False,
                                    default=1,
                                    verbose_name='parentMonth')
    amount = models.IntegerField(null=False, default=0, verbose_name='amount')

    class Meta:
        db_table = 'sub_fee_receipt_monthly'


##### Concession ######
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

class SubConcessionMonthly(models.Model):
    parentSubConcession = models.ForeignKey(SubConcession, models.PROTECT, default=0, verbose_name='parentSubConcession')
    parentMonth = models.ForeignKey(Month,
                                    on_delete=models.PROTECT,
                                    null=False,
                                    default=1,
                                    verbose_name='parentMonth')
    amount = models.IntegerField()

    class Meta:
        db_table = 'sub_concession_monthly'
