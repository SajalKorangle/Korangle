
from fee_second_app.models import FeeReceipt, SubFeeReceipt, SubFeeReceiptMonthly, \
    StudentFeeComponent, StudentMonthlyFeeComponent, FeeDefinition, Month

from fee_second_app.business.student_fee_status import get_student_fee_status_list

from fee_second_app.business.student_fee_dues import update_student_fee_dues

from student_app.models import Student

from django.db import transaction

from django.db.models import Max


def get_fee_receipt_by_id(data):

    fee_receipt_object = FeeReceipt.objects.get(id=data['dbId'])

    return get_fee_receipt_by_object(fee_receipt_object)


def get_fee_receipt_by_object(fee_receipt_object):

    fee_receipt_response = {}

    fee_receipt_response['dbId'] = fee_receipt_object.id

    fee_receipt_response['studentDbId'] = fee_receipt_object.parentStudent.id
    fee_receipt_response['studentName'] = fee_receipt_object.parentStudent.name
    fee_receipt_response['studentScholarNumber'] = fee_receipt_object.parentStudent.scholarNumber
    fee_receipt_response['studentFatherName'] = fee_receipt_object.parentStudent.fathersName
    fee_receipt_response['studentClassName'] = fee_receipt_object.parentStudent.get_class_name(fee_receipt_object.parentStudent.parentSchool.currentSession)
    fee_receipt_response['receiptNumber'] = fee_receipt_object.receiptNumber
    fee_receipt_response['generationDateTime'] = fee_receipt_object.generationDateTime
    fee_receipt_response['remark'] = fee_receipt_object.remark
    fee_receipt_response['cancelled'] = fee_receipt_object.cancelled

    if fee_receipt_object.parentReceiver is None:
        fee_receipt_response['parentReceiver'] = None
    else:
        fee_receipt_response['parentReceiver'] = fee_receipt_object.parentReceiver.id

    fee_receipt_response['subFeeReceiptList'] = []

    for sub_fee_receipt_object in SubFeeReceipt.objects.filter(parentFeeReceipt=fee_receipt_object).order_by('parentStudentFeeComponent__parentFeeDefinition__parentSession__orderNumber', 'parentStudentFeeComponent__parentFeeDefinition__orderNumber'):

        sub_fee_receipt_response = {}
        sub_fee_receipt_response['feeType'] = sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentFeeType.name
        sub_fee_receipt_response['sessionName'] = sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentSession.name
        sub_fee_receipt_response['componentDbId'] = sub_fee_receipt_object.parentStudentFeeComponent.id
        sub_fee_receipt_response['frequency'] = sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency

        if sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency == FeeDefinition.YEARLY_FREQUENCY:
            sub_fee_receipt_response['amount'] = sub_fee_receipt_object.amount
        elif sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

            sub_fee_receipt_response['monthList'] = []

            for sub_fee_receipt_monthly_object in SubFeeReceiptMonthly.objects.filter(parentSubFeeReceipt=sub_fee_receipt_object):

                sub_fee_receipt_monthly_response = {}
                sub_fee_receipt_monthly_response['month'] = sub_fee_receipt_monthly_object.parentMonth.name
                sub_fee_receipt_monthly_response['amount'] = sub_fee_receipt_monthly_object.amount

                sub_fee_receipt_response['monthList'].append(sub_fee_receipt_monthly_response)

        fee_receipt_response['subFeeReceiptList'].append(sub_fee_receipt_response)

    return fee_receipt_response


def get_fee_receipt_list_by_school_id(data):

    startDate = data['startDate'] + ' 00:00:00+05:30'
    endDate = data['endDate'] + ' 23:59:59+05:30'

    fee_receipt_list_response = []

    for fee_receipt_object in FeeReceipt.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                                        generationDateTime__gte=startDate,
                                                        generationDateTime__lte=endDate).order_by('-generationDateTime'):

        fee_receipt_list_response.append(get_fee_receipt_by_object(fee_receipt_object))

    return fee_receipt_list_response


def get_fee_receipt_list_by_school_user_id(data):

    startDate = data['startDate'] + ' 00:00:00+05:30'
    endDate = data['endDate'] + ' 23:59:59+05:30'

    fee_receipt_list_response = []

    for fee_receipt_object in FeeReceipt.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                                        parentReceiver_id=data['parentReceiver'],
                                                        generationDateTime__gte=startDate,
                                                        generationDateTime__lte=endDate).order_by('-generationDateTime'):

        fee_receipt_list_response.append(get_fee_receipt_by_object(fee_receipt_object))

    return fee_receipt_list_response


def get_fee_receipt_list_by_student_id(data):

    fee_receipt_list_response = []

    for fee_receipt_object in FeeReceipt.objects.filter(parentStudent_id=data['studentDbId']).order_by('-generationDateTime'):

        fee_receipt_response = get_fee_receipt_by_object(fee_receipt_object)
        fee_receipt_list_response.append(fee_receipt_response)

    return fee_receipt_list_response


def create_fee_receipt(data):

    student_object = Student.objects.get(id=data['studentDbId'])
    school_object = student_object.parentSchool

    with transaction.atomic():
        new_receipt_number = 1
        last_receipt_number = FeeReceipt.objects.filter(parentStudent__parentSchool=school_object).aggregate(Max('receiptNumber'))['receiptNumber__max']
        if last_receipt_number is not None:
            new_receipt_number = last_receipt_number + 1
        fee_receipt_object = FeeReceipt(receiptNumber=new_receipt_number,
                                        remark=data['remark'],
                                        parentStudent=student_object)
        fee_receipt_object.save()

        if 'parentReceiver' in data:
            fee_receipt_object.parentReceiver_id = data['parentReceiver']
            fee_receipt_object.save()

    for subFeeReceipt in data['subFeeReceiptList']:

        student_fee_component_object = StudentFeeComponent.objects.get(id=subFeeReceipt['componentDbId'])
        sub_fee_receipt_object = SubFeeReceipt(parentStudentFeeComponent=student_fee_component_object,
                                               parentFeeReceipt=fee_receipt_object)
        if subFeeReceipt['frequency'] == FeeDefinition.YEARLY_FREQUENCY:

            if subFeeReceipt['amount'] > student_fee_component_object.amountDue:
                subFeeReceipt['amount'] = student_fee_component_object.amountDue
            sub_fee_receipt_object.amount = subFeeReceipt['amount']

            sub_fee_receipt_object.save()

        elif subFeeReceipt['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:

            sub_fee_receipt_object.save()

            for subFeeReceiptMonthly in subFeeReceipt['monthList']:

                if subFeeReceiptMonthly['amount'] > 0:

                    month_object = Month.objects.get(name=subFeeReceiptMonthly['month'])
                    amountDue = StudentMonthlyFeeComponent.objects.get(parentMonth=month_object,
                                                                       parentStudentFeeComponent=sub_fee_receipt_object.parentStudentFeeComponent).amountDue
                    if subFeeReceiptMonthly['amount'] > amountDue:
                        subFeeReceiptMonthly['amount'] = amountDue
                    sub_fee_receipt_monthly_object = SubFeeReceiptMonthly(parentSubFeeReceipt=sub_fee_receipt_object,
                                                                          amount=subFeeReceiptMonthly['amount'],
                                                                          parentMonth=month_object)
                    sub_fee_receipt_monthly_object.save()

    update_student_fee_dues(student_object)

    response = {}
    response['message'] = 'Fees submitted successfully'
    response['feeReceipt'] = get_fee_receipt_by_id({'dbId': fee_receipt_object.id})
    response['studentFeeStatusList'] = get_student_fee_status_list({'studentDbId': student_object.id})

    return response
