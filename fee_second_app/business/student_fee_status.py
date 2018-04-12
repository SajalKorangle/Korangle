
from django.db.models import Sum

from student_app.models import Student

from fee_second_app.models import StudentFeeComponent, StudentFeeComponentMonthly, SchoolFeeComponentMonthly, \
    SubFeeReceipt, SubConcession

def get_student_fee_status(data):

    studentDbId = data['studentDbId']

    student_object = Student.objects.get(id=studentDbId)

    student_fee_status = {}
    student_fee_status['studentDbId'] = studentDbId

    if 'sessionDbId' in data:
    else:
        student_fee_status['sessionFeeStatus']

    student_fee_status['sessionFeeStatus'] = []

    return ''

def get_student_fee_status_by_session_id(studentDbId, sessionDbId):
    create_student_fee_component(studentDbId, sessionDbId)
    student_fee_status = {}
    student_fee_status['components'] = []
    for student_fee_component_object in \
            StudentFeeComponent.objects.filter(
                parentSchoolFeeComponent__parentFeeDefinition__parentSession_id=sessionDbId,
                parentStudent_id=studentDbId) \
                    .order_by('parentSchoolFeeComponent__parentFeeDefinition__orderNumber'):
        temp_student_fee_status = {}
        temp_student_fee_status['dbId'] = student_fee_component_object.id
        temp_student_fee_status['amount'] = student_fee_component_object.amount
        temp_student_fee_status['schoolAmount'] = student_fee_component_object.parentSchoolFeeComponent.amount
        temp_student_fee_status['feeType'] = student_fee_component_object.parentSchoolFeeComponent.parentFeeDefinition.parentFeeType.name
        temp_student_fee_status['remark'] = student_fee_component_object.remark
        temp_student_fee_status['bySchoolRules'] = student_fee_component_object.bySchoolRules
        temp_student_fee_status['monthList'] = []
        for student_monthly_fee_component_object in StudentFeeComponentMonthly.objects.filter(
                parentStudentFeeComponent=student_fee_component_object):
            temp_student_monthly_fee_status = {}
            temp_student_monthly_fee_status['month'] = student_monthly_fee_component_object.parentMonth.monthName
            temp_student_monthly_fee_status['amount'] = student_monthly_fee_component_object.amount
            temp_student_monthly_fee_status['schoolAmount'] \
                = SchoolFeeComponentMonthly.objects.get(parentMonth=student_monthly_fee_component_object.parentMonth,
                                                        parentSchoolFeeComponent=student_fee_component_object.parentSchoolFeeComponent) \
                .amount
            temp_student_fee_status['monthList'].append(temp_student_monthly_fee_status)
        amountPaid = SubFeeReceipt.objects.filter(parentStudentFeeComponent=student_fee_component_object).aggregate(Sum('amount'))['amount__sum']
        amountExempted = SubConcession.objects.filter(parentStudentFeeComponent=student_fee_component_object).aggregate(Sum('amount'))['amount__sum']
        temp_student_fee_status['amountDue'] = temp_student_fee_status['amount'] - amountPaid - amountExempted
        student_fee_status['components'].append(temp_student_fee_status)
    return student_fee_status

def create_student_fee_component(studentDbId, sessionDbId):



def create_or_update_student_fee_status(data):

    return ''