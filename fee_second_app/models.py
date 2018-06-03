from django.db import models

from django.db.models import Sum

from django.core.exceptions import ObjectDoesNotExist

# Create your models here.

from school_app.model.models import School, Session, BusStop

from student_app.models import Student, StudentSection

from class_app.models import Class

from django.contrib.auth.models import User


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
    orderNumber = models.IntegerField()


class FeeType(models.Model):
    name = models.TextField(verbose_name='name', unique=True)
    orderNumber = models.IntegerField(verbose_name='orderNumber', default=0)

    class Meta:
        db_table = 'fee_type'


##### School Rules #####
class FeeDefinition(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')

    orderNumber = models.IntegerField(verbose_name='orderNumber', default=0)

    rte = models.BooleanField(null=False, default=False, verbose_name='rte_allowed')
    onlyNewStudent = models.BooleanField(null=False, default=False, verbose_name='only_new_student')

    '''CLASS_BASED_FILTER = 'CLASS'
    BUS_STOP_BASED_FILTER = 'BUS STOP'
    CLASS_BUS_STOP_BASED_FILTER = 'CLASS AND BUS STOP'
    NO_FILTER = 'NONE'
    FILTERTYPE = (
        (CLASS_BASED_FILTER, 'Class'),
        (BUS_STOP_BASED_FILTER, 'Bus Stop'),
        (CLASS_BUS_STOP_BASED_FILTER, 'Class & Bus Stop'),
        (NO_FILTER, 'None')
    )
    filterType = models.CharField(max_length=9, choices=FILTERTYPE, null=False, default=NO_FILTER)'''

    classFilter = models.BooleanField(null=False, default=False, verbose_name='class_filter')

    busStopFilter = models.BooleanField(null=False, default=False, verbose_name='bus_stop_filter')

    MONTHLY_FREQUENCY = 'MONTHLY'
    QUATERLY_FREQUENCY = 'QUATERLY'
    YEARLY_FREQUENCY = 'YEARLY'
    FREQUENCY = (
        (MONTHLY_FREQUENCY, 'Monthly'),
        (QUATERLY_FREQUENCY, 'Quaterly'),
        (YEARLY_FREQUENCY, 'Yearly'),
    )
    frequency = models.CharField(max_length=10, choices=FREQUENCY, null=False, default=YEARLY_FREQUENCY)

    locked = models.BooleanField(null=False, default=False, verbose_name='locked')

    class Meta:
        db_table = 'fee_definition'

        unique_together = ('parentSchool', 'parentSession', 'parentFeeType')


class SchoolFeeComponent(models.Model):
    title = models.TextField(verbose_name='title')
    amount = models.IntegerField(null=True, verbose_name='amount')
    parentFeeDefinition = models.ForeignKey(FeeDefinition, on_delete=models.PROTECT, default=0,
                                            verbose_name='parentFeeDefinition')

    class Meta:
        db_table = 'school_fee_component'

        unique_together = ('parentFeeDefinition', 'title')


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
    amount = models.IntegerField(null=True, verbose_name='amount')
    bySchoolRules = models.BooleanField(null=False, default=True, verbose_name='bySchoolRules')

    remark = models.TextField()

    @property
    def schoolFeeComponent(self):
        fee_definition_object = self.parentFeeDefinition
        student_object = self.parentStudent

        # check rte constraint
        if (fee_definition_object.rte is False) and (student_object.rte == Student.RTE_YES):
            return None

        # check only new student constraint
        if fee_definition_object.onlyNewStudent is True:
            if (student_object.admissionSession is not None) \
                    and (student_object.admissionSession.id != fee_definition_object.parentSession.id):
                return None
            if student_object.admissionSession is None:
                return None

        # find student fee component by defined filters

        school_fee_component_queryset = SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)

        session_object = self.parentFeeDefinition.parentSession
        if fee_definition_object.classFilter:
            student_section_object = StudentSection.objects.get(parentStudent=student_object,
                                                                parentSection__parentClassSession__parentSession=session_object)
            class_object = student_section_object.parentSection.parentClassSession.parentClass
            for school_fee_component_object in school_fee_component_queryset:
                if school_fee_component_object.classbasedfilter_set.filter(parentClass=class_object).count() == 0:
                    school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

        if fee_definition_object.busStopFilter:
            bus_stop_object = student_object.currentBusStop
            for school_fee_component_object in school_fee_component_queryset:
                if school_fee_component_object.busstopbasedfilter_set.filter(parentBusStop=bus_stop_object).count() == 0:
                    school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

        if school_fee_component_queryset.count() == 0:
            return None
        elif school_fee_component_queryset.count() == 1:
            return school_fee_component_queryset[0]
        else:
            raise ValueError('More than one school fee component for a student')
            return None

    @property
    def schoolAmount(self):
        if self.schoolFeeComponent is None:
            return 0
        else:
            return self.schoolFeeComponent.amount

    @property
    def amountPaid(self):
        amountPaid = \
        SubFeeReceipt.objects.filter(parentStudentFeeComponent=self, parentFeeReceipt__cancelled=False).aggregate(
            Sum('amount'))['amount__sum']
        if amountPaid is None:
            return 0
        return amountPaid

    @property
    def amountExempted(self):
        amountExempted = SubConcession.objects.filter(parentStudentFeeComponent=self, parentConcessionSecond__cancelled=False).aggregate(Sum('amount'))['amount__sum']
        if amountExempted is None:
            return 0
        return amountExempted


    @property
    def amountDue(self):
        return self.amount-self.amountPaid-self.amountExempted

    class Meta:
        db_table = 'student_fee_component'

        unique_together = ('parentStudent', 'parentFeeDefinition')


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
    def amountPaid(self):
        amountPaid = SubFeeReceiptMonthly.objects.filter(
            parentSubFeeReceipt__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountPaid is None:
            return 0
        return amountPaid

    @property
    def amountExempted(self):
        amountExempted = SubConcessionMonthly.objects.filter(
            parentSubConcession__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountExempted is None:
            amountExempted = 0
        return amountExempted

    @property
    def amountDue(self):
        return self.amount-self.amountPaid-self.amountExempted
        '''amountPaid = SubFeeReceiptMonthly.objects.filter(
            parentSubFeeReceipt__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountPaid is None:
            amountPaid = 0
        amountExempted = SubConcessionMonthly.objects.filter(
            parentSubConcession__parentStudentFeeComponent=self.parentStudentFeeComponent,
            parentMonth=self.parentMonth).aggregate(Sum('amount'))['amount__sum']
        if amountExempted is None:
            amountExempted = 0
        return self.amount-amountPaid-amountExempted'''

    class Meta:
        db_table = 'student_fee_component_monthly'

        unique_together = ('parentStudentFeeComponent', 'parentMonth')


##### Receipts #######
class FeeReceipt(models.Model):
    receiptNumber = models.IntegerField(null=False, default=0, verbose_name='receiptNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')

    parentReceiver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='parentReceiver')

    class Meta:
        db_table = 'fee_receipt'


class SubFeeReceipt(models.Model):
    parentFeeReceipt = models.ForeignKey(FeeReceipt, models.PROTECT, default=0, verbose_name='parentFeeReceipt')
    parentStudentFeeComponent = models.ForeignKey(StudentFeeComponent, models.PROTECT, default=0,
                                                  verbose_name='parentStudentFeeComponent')
    amount = models.IntegerField(null=True, verbose_name='amount')

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
class ConcessionSecond(models.Model):
    remark = models.TextField(null=True, verbose_name='remark')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')

    parentReceiver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='parentReceiver')

    class Meta:
        db_table = 'concession_second'


class SubConcession(models.Model):
    parentConcessionSecond = models.ForeignKey(ConcessionSecond, models.PROTECT, default=0, verbose_name='parentConcessionSecond')
    parentStudentFeeComponent = models.ForeignKey(StudentFeeComponent, models.PROTECT, default=0,
                                                  verbose_name='parentStudent')
    amount = models.IntegerField(null=True, verbose_name='amount')

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
