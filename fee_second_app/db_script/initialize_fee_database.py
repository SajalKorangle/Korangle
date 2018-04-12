

def initialize_fee_database(apps, schema_editor):

    populate_fee_type(apps, schema_editor)

    populate_fee_structure(apps, schema_editor)

def populate_fee_type(apps, schema_editor):

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType(name='Fee 2017-18')
    fee_type_object.save()

def populate_fee_structure(apps, schema_editor):

    populate_school_fee_structure(apps, schema_editor, 'brightstar')

    populate_school_fee_structure(apps, schema_editor, 'brighthindi')


def populate_school_fee_structure(apps, schema_editor, schoolUser):

    FeeDefinition = apps.get_model('fee_second_app', 'FeeDefinition')

    School = apps.get_model('school_app', 'School')
    school_object = School.objects.get(user__username=schoolUser)

    Session = apps.get_model('school_app', 'Session')
    session_object = Session.objects.get(name='Session 2017-18')

    FeeType = apps.get_model('fee_second_app', 'FeeType')
    fee_type_object = FeeType.objects.get(name='Fee 2017-18')

    fee_definition_object = FeeDefinition(parentSchool=school_object, parentSession=session_object,
                                          parentFeeType=fee_type_object, rteAllowed=True, orderNumber=1,
                                          filterType='NONE', frequency='ANNUALLY')
    fee_definition_object.save()

    SchoolFeeComponent = apps.get_model('fee_second_app', 'SchoolFeeComponent')
    school_fee_component_object = SchoolFeeComponent(title='Fee 2017-18', amount=0, parentFeeDefinition=fee_definition_object)
    school_fee_component_object.save()

    StudentFeeComponent = apps.get_model('fee_second_app', 'StudentFeeComponent')
    Student = apps.get_model('student_app', 'Student')
    for student_object in Student.objects.filter(parentUser__username=schoolUser):
        student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                             parentSchoolFeeComponent=school_fee_component_object,
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
                                                   amount=fee_receipt_object.amount)
            sub_fee_receipt_object.save()

        Concession = apps.get_model('fee_app', 'Concession')
        for concession_object in Concession.objects.filter(parentStudent=student_object):

            Concession_Second = apps.get_model('fee_second_app', 'Concession')
            concession_second_object = Concession(remark=concession_object.remark,
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