
import fee_second_app, student_app

from fee_second_app.models import FeeDefinition


def initialize_fee_database(apps, schema_editor):

    populate_month(apps, schema_editor)

    populate_fee_type(apps, schema_editor)

    populate_dummy_bus_stops_for_champion_students(apps, schema_editor)

    populate_fee_structure(apps, schema_editor)


def populate_dummy_bus_stops_for_champion_students(apps, schema_editor):

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username='champion')

    Student = apps.get_model('student_app', 'Student')
    BusStop = apps.get_model('school_app', 'BusStop')

    for student_object in Student.objects.filter(parentUser__username='champion'):
        student_object.currentBusStop = BusStop.objects.get(parentSchool=school_object, stopName='Ashta')
        student_object.save()


def populate_month(apps, schema_editor):

    Month = apps.get_model('fee_second_app', 'Month')

    month_object = Month(name=fee_second_app.models.Month.APRIL, orderNumber=1)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.MAY, orderNumber=2)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.JUNE, orderNumber=3)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.JULY, orderNumber=4)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.AUGUST, orderNumber=5)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.SEPTEMBER, orderNumber=6)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.OCTOBER, orderNumber=7)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.NOVEMBER, orderNumber=8)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.DECEMBER, orderNumber=9)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.JANUARY, orderNumber=10)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.FEBRUARY, orderNumber=11)
    month_object.save()

    month_object = Month(name=fee_second_app.models.Month.MARCH, orderNumber=12)
    month_object.save()


def populate_fee_type(apps, schema_editor):

    FeeType = apps.get_model('fee_second_app', 'FeeType')

    fee_type_object = FeeType(name='Admission Fee', orderNumber=1)
    fee_type_object.save()

    fee_type_object = FeeType(name='Annual Fee', orderNumber=2)
    fee_type_object.save()

    fee_type_object = FeeType(name='Vehicle Fee', orderNumber=3)
    fee_type_object.save()

    fee_type_object = FeeType(name='Tuition Fee', orderNumber=4)
    fee_type_object.save()


def populate_fee_structure(apps, schema_editor):

    populate_bright_fee_structure(apps, schema_editor, 'brightstar')
    promote_bright_school(apps, schema_editor, 'brightstar')

    populate_bright_fee_structure(apps, schema_editor, 'brighthindi')
    promote_bright_school(apps, schema_editor, 'brighthindi')

    populate_bright_fee_structure(apps, schema_editor, 'brightstarsalsalai')
    promote_bright_school(apps, schema_editor, 'brightstarsalsalai')

    # populate_champion_school_fee_structure(apps, schema_editor)


def populate_champion_school_fee_structure(apps, schema_editor):

    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefinition')

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username='champion')

    Session = apps.get_model('school_app', 'Session')
    session_object = Session.objects.get(name='Session 2018-19')

    FeeType = apps.get_model('fee_second_app', 'FeeType')

    fee_type_object = FeeType.objects.get(name='Tuition Fee')
    fee_definition_object = FeeDefinition(parentSchool=school_object, parentSession=session_object,
                                          parentFeeType=fee_type_object, rte=False, orderNumber=fee_type_object.orderNumber,
                                          classFilter=True,
                                          busStopFilter=False,
                                          locked=True,
                                          frequency=fee_second_app.models.FeeDefinition.MONTHLY_FREQUENCY)
    fee_definition_object.save()

    SchoolFeeComponent=apps.get_model('fee_second_app', 'SchoolFeeComponent')

    school_fee_component_object = SchoolFeeComponent(title='Nursery-L.K.G. Tuition Fee', amount=7200, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'Nursery', school_fee_component_object)
    populate_class_filter(apps, schema_editor, 'L.K.G.', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,1800,0,0,1800,0,0,1800,0,0,1800,0,0)
    populate_champion_student_fee_structure(apps, schema_editor, school_fee_component_object)

    school_fee_component_object = SchoolFeeComponent(title='U.K.G. Tuition Fee', amount=8000, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'U.K.G.', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,2000,0,0,2000,0,0,2000,0,0,2000,0,0)
    populate_champion_student_fee_structure(apps, schema_editor, school_fee_component_object)

    school_fee_component_object = SchoolFeeComponent(title='1st-2nd Tuition Fee', amount=10000, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_class_filter(apps, schema_editor, 'Class - 1', school_fee_component_object)
    populate_class_filter(apps, schema_editor, 'Class - 2', school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,2500,0,0,2500,0,0,2500,0,0,2500,0,0)
    populate_champion_student_fee_structure(apps, schema_editor, school_fee_component_object)

    fee_type_object = FeeType.objects.get(name='Vehicle Fee')
    fee_definition_object = FeeDefinition(parentSchool=school_object, parentSession=session_object,
                                          parentFeeType=fee_type_object, rte=True, orderNumber=fee_type_object.orderNumber,
                                          busStopFilter=True,
                                          classFilter=False,
                                          locked=True,
                                          frequency=fee_second_app.models.FeeDefinition.MONTHLY_FREQUENCY)
    fee_definition_object.save()

    BusStop = apps.get_model('school_app', 'BusStop')

    school_fee_component_object = SchoolFeeComponent(title='Vehicle Fee', amount=3000, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()
    populate_bus_stop_filter(apps, schema_editor, BusStop.objects.get(stopName='Ashta', parentSchool=school_object), school_fee_component_object)
    populate_school_month_fees(apps, schema_editor, school_fee_component_object,300,0,0,300,300,300,300,300,300,300,300,300)
    populate_champion_student_fee_structure(apps, schema_editor, school_fee_component_object)


def populate_champion_student_fee_structure(apps, schema_editor, school_fee_component_object):

    Student = apps.get_model('student_app', 'Student')
    Session = apps.get_model('school_app', 'Session')
    ClassBasedFilter = apps.get_model('fee_second_app', 'ClassBasedFilter')
    BusStopBasedFilter = apps.get_model('fee_second_app', 'BusStopBasedFilter')
    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')

    fee_definition_object = school_fee_component_object.parentFeeDefinition

    for student_object in Student.objects.filter(parentUser__username='champion'):

        # if fee_definition_object.filterType == FeeDefinition.CLASS_BASED_FILTER:
        if fee_definition_object.classFilter == True:

            classDbId = student_app.models.Student.get_class_id(student_object, Session.objects.get(name='Session 2018-19'))
            if ClassBasedFilter.objects.filter(parentClass_id=classDbId, parentSchoolFeeComponent=school_fee_component_object).count()==1:

                student_fee_component_object = StudentFeeComponent(parentFeeDefinition=fee_definition_object,
                                                                   bySchoolRules=True,
                                                                   amount=school_fee_component_object.amount,
                                                                   parentStudent=student_object)
                student_fee_component_object.save()

                if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
                    populate_student_month_fees(apps, schema_editor, school_fee_component_object, student_fee_component_object)

        # elif fee_definition_object.filterType == FeeDefinition.BUS_STOP_BASED_FILTER:
        elif fee_definition_object.busStopFilter == True:

            if BusStopBasedFilter.objects.filter(parentBusStop=student_object.currentBusStop, parentSchoolFeeComponent=school_fee_component_object).count()==1:

                student_fee_component_object = StudentFeeComponent(parentFeeDefinition=fee_definition_object,
                                                                   bySchoolRules=True,
                                                                   amount=school_fee_component_object.amount,
                                                                   parentStudent=student_object)
                student_fee_component_object.save()

                if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
                    populate_student_month_fees(apps, schema_editor, school_fee_component_object, student_fee_component_object)


def populate_student_month_fees(apps, schema_editor, school_fee_component_object, student_fee_component_object):

    Month = apps.get_model('fee_second_app', 'Month')
    SchoolMonthlyFeeComponent = apps.get_model('fee_second_app', 'SchoolMonthlyFeeComponent')
    StudentMonthlyFeeComponent = apps.get_model('fee_second_app', 'StudentMonthlyFeeComponent')

    month_object = Month.objects.get(name=fee_second_app.models.Month.APRIL)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.MAY)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.JUNE)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.JULY)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.AUGUST)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.SEPTEMBER)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.OCTOBER)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.NOVEMBER)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.DECEMBER)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.JANUARY)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.FEBRUARY)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()

    month_object = Month.objects.get(name=fee_second_app.models.Month.MARCH)
    school_monthly_fee_component_object = SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,parentMonth=month_object)
    student_monthly_fee_component_object = StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                                                      parentMonth=month_object,amount=school_monthly_fee_component_object.amount)
    student_monthly_fee_component_object.save()


def populate_school_month_fees(apps, schema_editor, school_fee_component_object, apr, may, jun, jul, aug, sep, oct, nov, dec, jan, feb, mar):

    Month = apps.get_model('fee_second_app', 'Month')
    SchoolMonthlyFeeComponent = apps.get_model('fee_second_app', 'SchoolMonthlyFeeComponent')

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=fee_second_app.models.Month.APRIL),
        amount=apr)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=fee_second_app.models.Month.MAY),
        amount=may)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object,parentMonth=Month.objects.get(name=fee_second_app.models.Month.JUNE),
        amount=jun)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.JULY),
        amount=jul)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.AUGUST),
        amount=aug)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.SEPTEMBER),
        amount=sep)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.OCTOBER),
        amount=oct)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.NOVEMBER),
        amount=nov)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.DECEMBER),
        amount=dec)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.JANUARY),
        amount=jan)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.FEBRUARY),
        amount=feb)
    school_monthly_fee_component_object.save()

    school_monthly_fee_component_object = SchoolMonthlyFeeComponent(
        parentSchoolFeeComponent=school_fee_component_object, parentMonth=Month.objects.get(name=fee_second_app.models.Month.MARCH),
        amount=mar)
    school_monthly_fee_component_object.save()


def populate_bus_stop_filter(apps, schema_editor, bus_stop_object, school_fee_component_object):

    BusStop = apps.get_model('school_app', 'BusStop')
    BusStopBasedFilter = apps.get_model('fee_second_app', 'BusStopBasedFilter')
    bus_stop_based_filter_object = BusStopBasedFilter(parentBusStop=bus_stop_object,
                                                      parentSchoolFeeComponent=school_fee_component_object)
    bus_stop_based_filter_object.save()


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
                                          parentFeeType=fee_type_object, rte=True, orderNumber=fee_type_object.orderNumber,
                                          busStopFilter=False,
                                          classFilter=False,
                                          locked=True,
                                          frequency=fee_second_app.models.FeeDefinition.YEARLY_FREQUENCY)
    fee_definition_object.save()

    SchoolFeeComponent = apps.get_model('fee_second_app', 'SchoolFeeComponent')
    school_fee_component_object = SchoolFeeComponent(title='Annual Fee', amount=0, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()

    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')
    Student = apps.get_model('student_app', 'Student')
    for student_object in Student.objects.filter(parentUser__username=schoolUser):
        student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                           parentFeeDefinition=fee_definition_object,
                                                           amount=student_object.totalFees,
                                                           bySchoolRules=False)
        student_fee_component_object.save()

        if schoolUser == 'brighthindi':
            continue

        Fee = apps.get_model('fee_app', 'Fee')
        for fee_object in Fee.objects.filter(parentStudent=student_object):

            FeeReceipt = apps.get_model('fee_second_app', 'FeeReceipt')
            fee_receipt_object = FeeReceipt(receiptNumber=fee_object.receiptNumber,
                                            remark=fee_object.remark,
                                            cancelled=False,
                                            parentStudent=student_object)
            fee_receipt_object.save()
            # fee_receipt_object.generationDateTime = get_datetime_from_date(fee_object.generationDateTime)
            fee_receipt_object.generationDateTime = get_receipt_date_time(fee_object.generationDateTime)
            fee_receipt_object.save()

            SubFeeReceipt = apps.get_model('fee_second_app', 'SubFeeReceipt')
            sub_fee_receipt_object = SubFeeReceipt(parentFeeReceipt=fee_receipt_object,
                                                   parentStudentFeeComponent=student_fee_component_object,
                                                   amount=fee_object.amount)
            sub_fee_receipt_object.save()

        Concession = apps.get_model('fee_app', 'Concession')
        Concession_Second = apps.get_model('fee_second_app', 'ConcessionSecond')
        for concession_object in Concession.objects.filter(parentStudent=student_object):

            concession_second_object = Concession_Second(remark=concession_object.remark, parentStudent=student_object)
            concession_second_object.save()
            # concession_second_object.generationDateTime=get_datetime_from_date(concession_object.generationDateTime)
            concession_second_object.generationDateTime=get_receipt_date_time(concession_object.generationDateTime)
            concession_second_object.save()

            SubConcession = apps.get_model('fee_second_app', 'SubConcession')
            sub_concession_object = SubConcession(parentConcessionSecond=concession_second_object,
                                                  parentStudentFeeComponent=student_fee_component_object,
                                                  amount=concession_object.amount)
            sub_concession_object.save()


def promote_bright_school(apps, schema_editor, schoolUser):

    StudentSection = apps.get_model('student_app', 'StudentSection')
    Section = apps.get_model('class_app', 'Section')
    Class = apps.get_model('class_app', 'Class')

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username=schoolUser)

    Session = apps.get_model('school_app', 'Session')
    session_object = Session.objects.get(name='Session 2018-19')

    school_object.currentSession = session_object
    school_object.save()

    for student_section_object in \
        StudentSection.objects.filter(parentStudent__parentUser__username=schoolUser,
                                      parentSection__parentClassSession__parentSession__name='Session 2017-18'):

        class_object = student_section_object.parentSection.parentClassSession.parentClass
        section_object = student_section_object.parentSection

        new_class_object = None
        if class_object.name == 'Nursery':
            new_class_object = Class.objects.get(name='L.K.G.')
        elif class_object.name == 'L.K.G.':
            new_class_object = Class.objects.get(name='U.K.G.')
        elif class_object.name == 'U.K.G.':
            new_class_object = Class.objects.get(name='Class - 1')
        elif class_object.name == 'Class - 1':
            new_class_object = Class.objects.get(name='Class - 2')
        elif class_object.name == 'Class - 2':
            new_class_object = Class.objects.get(name='Class - 3')
        elif class_object.name == 'Class - 3':
            new_class_object = Class.objects.get(name='Class - 4')
        elif class_object.name == 'Class - 4':
            new_class_object = Class.objects.get(name='Class - 5')
        elif class_object.name == 'Class - 5':
            new_class_object = Class.objects.get(name='Class - 6')
        elif class_object.name == 'Class - 6':
            new_class_object = Class.objects.get(name='Class - 7')
        elif class_object.name == 'Class - 7':
            new_class_object = Class.objects.get(name='Class - 8')
        elif class_object.name == 'Class - 8':
            new_class_object = Class.objects.get(name='Class - 9')
        elif class_object.name == 'Class - 9':
            new_class_object = Class.objects.get(name='Class - 10')
        elif class_object.name == 'Class - 10':
            continue
        elif class_object.name == 'Class - 11':
            new_class_object = Class.objects.get(name='Class - 12')
        elif class_object.name == 'Class - 12':
            continue

        new_section_object = Section.objects.get(name=section_object.name,
                                                 parentClassSession__parentClass=new_class_object,
                                                 parentClassSession__parentSession__name='Session 2018-19')

        promoted_student_section_object = StudentSection(parentStudent=student_section_object.parentStudent,
                                                         parentSection=new_section_object,
                                                         rollNumber=student_section_object.rollNumber)
        promoted_student_section_object.save()


from datetime import datetime, date


def get_receipt_date_time(date):

    fixed_date = datetime.today().date()

    if date > fixed_date:
        return get_datetime_from_date(fixed_date)
    else:
        return get_datetime_from_date(date)


def get_datetime_from_date(date):

    return str(datetime.combine(date, datetime.min.time())) + '+05:30'
