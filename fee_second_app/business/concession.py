
from fee_second_app.models import ConcessionSecond, SubConcession, SubConcessionMonthly, \
    StudentFeeComponent, StudentMonthlyFeeComponent, FeeDefinition, Month

from fee_second_app.business.student_fee_status import get_student_fee_status_list

from fee_second_app.business.student_fee_dues import update_student_fee_dues

from student_app.models import Student


def get_concession_by_id(data):

    concession_object = ConcessionSecond.objects.get(id=data['dbId'])

    return get_concession_by_object(concession_object)


def get_concession_by_object(concession_object):

    concession_response = {}

    concession_response['dbId'] = concession_object.id

    concession_response['studentDbId'] = concession_object.parentStudent.id
    concession_response['studentName'] = concession_object.parentStudent.name
    concession_response['studentScholarNumber'] = concession_object.parentStudent.scholarNumber
    concession_response['studentFatherName'] = concession_object.parentStudent.fathersName
    concession_response['studentClassName'] = concession_object.parentStudent.get_class_name(concession_object.parentStudent.parentSchool.currentSession)
    concession_response['generationDateTime'] = concession_object.generationDateTime
    concession_response['remark'] = concession_object.remark
    concession_response['cancelled'] = concession_object.cancelled

    if concession_object.parentEmployee is None:
        concession_response['parentEmployee'] = None
    else:
        concession_response['parentEmployee'] = concession_object.parentEmployee.id

    concession_response['subConcessionList'] = []

    for sub_concession_object in SubConcession.objects.filter(parentConcessionSecond=concession_object).order_by('parentStudentFeeComponent__parentFeeDefinition__parentSession__orderNumber', 'parentStudentFeeComponent__parentFeeDefinition__orderNumber'):

        sub_concession_response = {}
        sub_concession_response['feeType'] = sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.parentFeeType.name
        sub_concession_response['sessionName'] = sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.parentSession.name
        sub_concession_response['componentDbId'] = sub_concession_object.parentStudentFeeComponent.id
        sub_concession_response['amount'] = sub_concession_object.amount
        sub_concession_response['frequency'] = sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.frequency

        if sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.frequency == 'MONTHLY':

            sub_concession_response['monthList'] = []

            for sub_concession_monthly_object in SubConcessionMonthly.objects.filter(parentSubConcession=sub_concession_object):

                sub_concession_monthly_response = {}
                sub_concession_monthly_response['month'] = sub_concession_monthly_object.parentMonth.name
                sub_concession_monthly_response['amount'] = sub_concession_monthly_object.amount

                sub_concession_response['monthList'].append(sub_concession_monthly_response)

        concession_response['subConcessionList'].append(sub_concession_response)

    return concession_response


def get_concession_list_by_school_id(data):

    startDate = data['startDate'] + ' 00:00:00+05:30'
    endDate = data['endDate'] + ' 23:59:59+05:30'

    concession_list_response = []

    for concession_object in ConcessionSecond.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                                        generationDateTime__gte=startDate,
                                                        generationDateTime__lte=endDate).order_by('-generationDateTime'):

        concession_list_response.append(get_concession_by_object(concession_object))

    return concession_list_response


def get_concession_list_by_student_id(data):

    concession_list_response = []

    for concession_object in ConcessionSecond.objects.filter(parentStudent_id=data['studentDbId']).order_by('-generationDateTime'):

        concession_response = get_concession_by_object(concession_object)
        concession_list_response.append(concession_response)

    return concession_list_response


def create_concession(data):

    student_object = Student.objects.get(id=data['studentDbId'])

    concession_object = ConcessionSecond(remark=data['remark'], parentStudent=student_object)
    concession_object.save()

    if 'parentEmployee' in data:
        concession_object.parentEmployee_id = data['parentEmployee']
        concession_object.save()

    for subConcession in data['subConcessionList']:

        student_fee_component_object = StudentFeeComponent.objects.get(id=subConcession['componentDbId'])
        sub_concession_object = SubConcession(parentStudentFeeComponent=student_fee_component_object,
                                               parentConcessionSecond=concession_object)

        if subConcession['frequency'] == FeeDefinition.YEARLY_FREQUENCY:

            if subConcession['amount'] > student_fee_component_object.amountDue:
                subConcession['amount'] = student_fee_component_object.amountDue
            sub_concession_object.amount = subConcession['amount']

            sub_concession_object.save()

        elif subConcession['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:

            sub_concession_object.save()

            for subConcessionMonthly in subConcession['monthList']:

                month_object = Month.objects.get(name=subConcessionMonthly['month'])
                amountDue = StudentMonthlyFeeComponent.objects.get(parentMonth=month_object,
                                                                   parentStudentFeeComponent=sub_concession_object.parentStudentFeeComponent).amountDue
                if subConcessionMonthly['amount'] > amountDue:
                    subConcessionMonthly['amount'] = amountDue
                sub_concession_monthly_object = SubConcessionMonthly(parentSubConcession=sub_concession_object,
                                                                      amount=subConcessionMonthly['amount'],
                                                                      parentMonth=month_object)
                sub_concession_monthly_object.save()

    update_student_fee_dues(student_object)

    response = {}
    response['message'] = 'Concession given successfully'
    response['concession'] = get_concession_by_id({'dbId': concession_object.id})
    response['studentFeeStatusList'] = get_student_fee_status_list({'studentDbId': student_object.id})

    return response
