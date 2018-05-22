
# Models
from student_app.models import StudentSection


def get_student_full_profile(student_section_object):

    student_object = student_section_object.parentStudent

    student_data = {}
    student_data['name'] = student_object.name
    student_data['dbId'] = student_object.id
    student_data['fathersName'] = student_object.fathersName
    student_data['mobileNumber'] = student_object.mobileNumber
    student_data['dateOfBirth'] = student_object.dateOfBirth
    student_data['remark'] = student_object.remark
    student_data['rollNumber'] = student_section_object.rollNumber
    student_data['scholarNumber'] = student_object.scholarNumber
    student_data['motherName'] = student_object.motherName
    student_data['gender'] = student_object.gender
    student_data['caste'] = student_object.caste
    student_data['category'] = student_object.newCategoryField
    student_data['religion'] = student_object.newReligionField
    student_data['fatherOccupation'] = student_object.fatherOccupation
    student_data['address'] = student_object.address
    student_data['familySSMID'] = student_object.familySSMID
    student_data['childSSMID'] = student_object.childSSMID
    student_data['bankName'] = student_object.bankName
    student_data['bankAccountNum'] = student_object.bankAccountNum
    student_data['aadharNum'] = student_object.aadharNum
    student_data['bloodGroup'] = student_object.bloodGroup
    student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome
    student_data['rte'] = student_object.rte

    if student_object.currentBusStop is not None:
        student_data['busStopDbId'] = student_object.currentBusStop.id
    else:
        student_data['busStopDbId'] = None

    if student_object.admissionSession is not None:
        student_data['admissionSessionDbId'] = student_object.admissionSession.id
    else:
        student_data['admissionSessionDbId'] = None

    student_data['sectionDbId'] = student_section_object.parentSection.id
    student_data['sectionName'] = student_section_object.parentSection.name
    student_data['className'] = student_section_object.parentSection.parentClassSession.parentClass.name
    student_data['classDbId'] = student_section_object.parentSection.parentClassSession.parentClass.id

    return student_data


def get_student_full_profile_by_school_and_session_id(data):

    student_list = []

    for student_section_object in \
        StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                      parentSection__parentClassSession__parentSession_id=data['sessionDbId']) \
        .order_by('parentSection__parentClassSession__parentClass__orderNumber', 'parentSection__orderNumber', 'parentStudent__name') \
        .select_related('parentStudent', 'parentSection__parentClassSession__parentClass'):

        student_list.append(get_student_full_profile(student_section_object))

    return student_list