
from fee_second_app.models import StudentFeeDues, FeeDefinition
from student_app.models import StudentSection
from school_app.model.models import Session

from fee_second_app.business.student_fee_status import get_student_fee_status_list


def get_student_fee_dues_list_by_school_and_session_id(data):

    student_fee_dues_list = []

    session_object = Session.objects.get(id=data['sessionDbId'])

    for student_section_object in \
            StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                          parentSection__parentClassSession__parentSession=session_object) \
                    .order_by('parentStudent__name') \
                    .select_related('parentSection__parentClassSession__parentClass',
                                    'parentStudent__currentBusStop'):
        student_fee_dues_list.append(get_student_fee_dues(student_section_object))

    return student_fee_dues_list


def get_student_fee_dues(student_section_object):

    student_fee_dues_response = dict()

    student_fee_dues_response['name'] = student_section_object.parentStudent.name
    student_fee_dues_response['dbId'] = student_section_object.parentStudent.id
    student_fee_dues_response['fathersName'] = student_section_object.parentStudent.fathersName
    student_fee_dues_response['scholarNumber'] = student_section_object.parentStudent.scholarNumber
    student_fee_dues_response['mobileNumber'] = student_section_object.parentStudent.mobileNumber

    busStop = student_section_object.parentStudent.currentBusStop
    if busStop is None:
        student_fee_dues_response['stopName'] = None
    else:
        student_fee_dues_response['stopName'] = busStop.stopName

    student_fee_dues_response['className'] = student_section_object.parentSection.parentClassSession.parentClass.name
    student_fee_dues_response['sectionName'] = student_section_object.parentSection.name
    student_fee_dues_response['sectionDbId'] = student_section_object.parentSection.id
    student_fee_dues_response['rte'] = student_section_object.parentStudent.rte

    parentTransferCertificate = student_section_object.parentStudent.parentTransferCertificate
    if parentTransferCertificate is None:
        student_fee_dues_response['parentTransferCertificate'] = None
    else:
        student_fee_dues_response['parentTransferCertificate'] = parentTransferCertificate.id

    student_fee_dues_response['feesDue'] = \
        StudentFeeDues.objects.get(parentStudent=student_section_object.parentStudent).amount

    return student_fee_dues_response


def update_student_fee_dues(student_object):

    student_fee_dues_queryset = StudentFeeDues.objects.filter(parentStudent=student_object)

    if student_fee_dues_queryset.count() > 0:
        student_fee_dues_object = student_fee_dues_queryset[0]
    else:
        student_fee_dues_object = StudentFeeDues(parentStudent=student_object, amount=0)
        student_fee_dues_object.save()

    student_fee_status_list = get_student_fee_status_list({'studentDbId': student_object.id})

    amount = 0

    for student_fee_status in student_fee_status_list:

        for component_list in student_fee_status['componentList']:

            if component_list['frequency'] == FeeDefinition.YEARLY_FREQUENCY:

                amount += component_list['amountDue']

            elif component_list['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:

                for month_list in component_list['monthList']:

                    amount += month_list['amountDue']

    student_fee_dues_object.amount = amount
    student_fee_dues_object.save()
