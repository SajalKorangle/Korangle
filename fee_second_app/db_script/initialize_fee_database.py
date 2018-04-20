

def initialize_fee_database(apps, schema_editor):

    populate_fee_type(apps, schema_editor)

    populate_fee_structure(apps, schema_editor)

def populate_fee_type(apps, schema_editor):

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType(name='Annual Fee')
    fee_type_object.save()


    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType(name='Tuition Fee')
    fee_type_object.save()

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType(name='Transportation Charges')
    fee_type_object.save()


def populate_fee_structure(apps, schema_editor):

    populate_bright_fee_structure(apps, schema_editor, 'brightstar')

    populate_bright_fee_structure(apps, schema_editor, 'brighthindi')

    populate_champion_school_fee_structure(apps, schema_editor)

    populate_champion_student_fee_structure(apps, schema_editor)

def populate_champion_school_fee_structure(apps, schema_editor):

    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefintion')

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username='champion')

    Session = apps.get_model('school_app', 'Session')
    session_object = Session.objects.get(name='Session 2018-19')

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object_one = FeeType.objects.get(name='Tuition Fee')

    fee_definition_object = FeeDefinition(parentSchool=school_object, parentSession=session_object,
                                         parentFeeType=fee_type_object_one, rteAllowed=False, orderNumber=1,
                                         filterType=FeeDefinition.CLASS_BASED_FILTER, frequency=FeeDefinition.MONTHLY_FREQUENCY)
    fee_definition_object.save()

    SchoolFeeComponent=apps.get_model('fee_second_app', 'SchoolFeeComponent')

    school_fee_component_object = SchoolFeeComponent(title='Nursery-L.K.G. Tuition Fee', amount=7200, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'Nursery', school_fee_component_object)
    populate_class_filter(apps, schema_editor, 'L.K.G.', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,1800,0,0,1800,0,0,1800,0,0,1800,0,0)

    school_fee_component_object = SchoolFeeComponent(title='U.K.G. Tuition Fee', amount=8000, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'U.K.G.', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,2000,0,0,2000,0,0,2000,0,0,2000,0,0)

    school_fee_component_object = SchoolFeeComponent(title='1st-2nd Tuition Fee', amount=10000, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'Class - 1', school_fee_component_object)
    populate_class_filter(apps, schema_editor, 'Class - 2', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,2500,0,0,2500,0,0,2500,0,0,2500,0,0)

def populate_chamption_student_fee_structure(apps, schema_editor):

    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')
    Student = apps.get_model('student_app', 'Student')

    for student_object in Student.objects.filter(parentUser__username='champion'):

        school_fee_component_object =

def get_school_fee_component_object(apps, schema_editor, student_object, session_object):




def populate_school_month_fees(apps, schema_editor, school_fee_component_object, apr, may, jun, jul, aug, sep, oct, nov, dec, jan, feb, mar):

    Month = apps.get_model('fee_second_app', 'Month')
    SchoolMonthlyFeeComponent = apps.get_model('fee_second_app', 'SchoolMonthlyFeeComponent')

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=Month.APRIL),
        amount=apr)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=Month.MAY),
        amount=may)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=Month.JUNE),
        amount=jun)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.JULY),
        amount=jul)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.AUGUST),
        amount=aug)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.SEPTEMBER),
        amount=sep)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.OCTOBER),
        amount=oct)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.NOVEMBER),
        amount=nov)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.DECEMBER),
        amount=dec)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.JANUARY),
        amount=jan)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.FEBRUARY),
        amount=feb)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=Month.MARCH),
        amount=mar)
    school_monthly_fee_component_object.save()

def populate_class_filter(apps, schema_editor, className, school_fee_component_object):

    Class = apps.get_model('class_app', 'Class')
    ClassBasedFee = apps.get_model('fee_second_app', 'ClassBasedFilter')
    class_based_fee_object = ClassBasedFee(parentClass=Class.objects.get(name=className),
                                           parentSchoolFeeComponent=school_fee_component_object)
    class_based_fee_object.save()

def populate_bright_fee_structure(apps, schema_editor, schoolUser):

    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefinition')

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username=schoolUser)

    Session = apps.get_model('school_app', 'Session')
    session_object = Session.objects.get(name='Session 2017-18')

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType.objects.get(name='Annual Fee')

    fee_definition_object = FeeDefinition(parentSchool=school_object, parentSession=session_object,
                                          parentFeeType=fee_type_object, rteAllowed=True, orderNumber=1,
                                          filterType=FeeDefinition.NO_FILTER, frequency=FeeDefinition.ANNUALLY_FREQUENCY)
    fee_definition_object.save()

    SchoolFeeComponent = apps.get_model('fee_second_app', 'SchoolFeeComponent')
    school_fee_component_object = SchoolFeeComponent(title='All Student Fees', amount=0, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()

    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')
    Student = apps.get_model('student_app', 'Student')
    for student_object in Student.objects.filter(parentUser__username=schoolUser):
        student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                           parentFeeDefinition=fee_definition_object,
                                                           amount=student_object.totalFees,
                                                           bySchoolRules=False)
        student_fee_component_object.save()

        Fee = apps.get_model('fee_app', 'Fee')
        for fee_object in Fee.objects.filter(parentStudent=student_object):

            FeeReceipt = apps.get_model('fee_second_app', 'FeeReceipt')
            fee_receipt_object = FeeReceipt(receiptNumber=fee_object.receiptNumber,
                                            generationDateTime=get_datetime_from_date(fee_object.generationDateTime),
                                            remark=fee_object.remark,
                                            cancelled=False,
                                            parentStudent=student_object)
            fee_receipt_object.save()

            SubFeeReceipt = apps.get_model('fee_second_app', 'SubFeeReceipt')
            sub_fee_receipt_object = SubFeeReceipt(parentFeeReceipt=fee_receipt_object,
                                                   parentStudentFeeComponent=student_fee_component_object,
                                                   amount=fee_object.amount)
            sub_fee_receipt_object.save()

        Concession = apps.get_model('fee_app', 'Concession')
        for concession_object in Concession.objects.filter(parentStudent=student_object):

            Concession_Second = apps.get_model('fee_second_app', 'Concession')
            concession_second_object = Concession_Second(remark=concession_object.remark,
                                                         generationDateTime=get_datetime_from_date(concession_object.generationDateTime))
            concession_second_object.save()

            SubConcession = apps.get_model('fee_second_app', 'SubConcession')
            sub_concession_object = SubConcession(parentConcession=concession_second_object,
                                                  parentStudentFeeComponent=student_fee_component_object,
                                                  amount=concession_object.amount)
            sub_concession_object.save()



from datetime import datetime

def get_datetime_from_date(date):

    datetime.combine(date, datetime.min.time())

def populate_month(apps, schema_editor):

    Month = apps.get_model