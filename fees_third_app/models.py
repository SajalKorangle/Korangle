from django.db import models

from school_app.model.models import School, Session, BusStop

from class_app.models import Class, Division

from student_app.models import Student

from employee_app.models import Employee

from django.contrib.auth.models import User

# Create your models here.


class FeeType(models.Model):

    name = models.TextField(verbose_name='name')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    orderNumber = models.IntegerField(verbose_name='orderNumber', default=0)

    class Meta:
        db_table = 'fee_type_new'
        unique_together = ('name', 'parentSchool')


class SchoolFeeRule(models.Model):

    name = models.TextField(verbose_name='name')
    ruleNumber = models.IntegerField(verbose_name='ruleNumber', default=0)

    isClassFilter = models.BooleanField(verbose_name='isClassFilter', default=False)
    isBusStopFilter = models.BooleanField(verbose_name='isBusStopFilter', default=False)
    onlyNewAdmission = models.BooleanField(verbose_name='onlyNewAdmission', default=False)
    includeRTE = models.BooleanField(verbose_name='includeRTE', default=True)

    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')

    class Meta:
        db_table = 'school_fee_rule'
        unique_together = [('ruleNumber', 'parentFeeType', 'parentSession'), ('name', 'parentFeeType', 'parentSession')]


class ClassFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, default=0, verbose_name='parentDivision')

    class Meta:
        db_table = 'class_filter_fee'


class BusStopFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentBusStop = models.ForeignKey(BusStop, on_delete=models.CASCADE, default=0, verbose_name='parentBusStop')

    class Meta:
        db_table = 'bus_stop_filter_fee'


class StudentFee(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, default=0, verbose_name='parentStudent')
    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')

    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')
    aprilClearanceDate = models.DateField(null=True, verbose_name='aprilClearanceDate')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')
    mayClearanceDate = models.DateField(null=True, verbose_name='mayClearanceDate')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')
    juneClearanceDate = models.DateField(null=True, verbose_name='juneClearanceDate')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')
    julyClearanceDate = models.DateField(null=True, verbose_name='julyClearanceDate')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')
    augustClearanceDate = models.DateField(null=True, verbose_name='augustClearanceDate')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')
    septemberClearanceDate = models.DateField(null=True, verbose_name='septemberClearanceDate')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')
    octoberClearanceDate = models.DateField(null=True, verbose_name='octoberClearanceDate')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')
    novemberClearanceDate = models.DateField(null=True, verbose_name='novemberClearanceDate')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')
    decemberClearanceDate = models.DateField(null=True, verbose_name='decemberClearanceDate')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')
    januaryClearanceDate = models.DateField(null=True, verbose_name='januaryClearanceDate')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')
    februaryClearanceDate = models.DateField(null=True, verbose_name='februaryClearanceDate')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')
    marchClearanceDate = models.DateField(null=True, verbose_name='marchClearanceDate')

    class Meta:
        db_table = 'student_fee'
        unique_together = ('parentSchoolFeeRule', 'parentStudent')


class FeeReceipt(models.Model):

    receiptNumber = models.IntegerField(null=False, default=0, verbose_name='receiptNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='parentEmployee')

    MODE_OF_PAYMENT = (
        ( 'Cash', 'Cash' ),
        ( 'Check', 'Check' ),
    )
    modeOfPayment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT, null=True)

    class Meta:
        db_table = 'fee_receipt_new'
        unique_together = ('receiptNumber', 'parentSchool')


class SubFeeReceipt(models.Model):

    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, default=0, verbose_name='parentFeeReceipt')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, verbose_name='parentStudentFee')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')

    class Meta:
        db_table = 'sub_fee_receipt__new'


class Discount(models.Model):

    discountNumber = models.IntegerField(null=False, default=0, verbose_name='discountNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='parentStudent')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, null=True, verbose_name='parentEmployee')

    class Meta:
        db_table = 'discount_new'
        unique_together = ('discountNumber', 'parentSchool')


class SubDiscount(models.Model):

    parentDiscount = models.ForeignKey(Discount, on_delete=models.PROTECT, default=0, verbose_name='parentDiscount')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, verbose_name='parentStudentFee')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')

    class Meta:
        db_table = 'sub_discount_new'


class LockFee(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    locked = models.BooleanField(verbose_name='locked', default=False)

    class Meta:
        db_table = 'lock_fee'


class FeeFeature(models.Model):

    heading = models.TextField(verbose_name='heading')
    requirement = models.TextField(verbose_name='requirement')
    reason = models.TextField(verbose_name='reason')
    example = models.TextField(verbose_name='example')
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0, verbose_name='parentUser')

    class Meta:
        db_table = 'fee_feature'
