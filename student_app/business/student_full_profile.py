
# Models
from student_app.models import StudentSection, Student

# business
from student_app.business.student_section import create_student_section


from rest_framework import serializers


class StudentModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


def partially_update_student_full_profile(data):

    student_profile_serializer = StudentModelSerializer(Student.objects.get(id=data['id']), data=data, partial=True)
    if student_profile_serializer.is_valid():
        student_profile_serializer.save()
        return {
            'status': 'success',
            'message': 'Student Profile updated successfully',
        }
    else:
        return {
            'status': 'failure',
            'message': 'Student Profile updation failed',
        }


def create_student_full_profile(student):

    student_object = StudentModelSerializer(data=student)
    if student_object.is_valid():
        student_object.save()
        student_section_data = {
            'parentStudent': student_object.data['id'],
            'parentDivision': student['parentDivision'],
            'parentClass': student['parentClass'],
            'parentSession': student['parentSession'],
            'rollNumber': student['rollNumber'],
        }
        response = create_student_section(student_section_data)
        if response['status'] == 'success':
            return {
                'status': 'success',
                'message': 'Student Profile created successfully',
            }
        else:
            return response
    else:
        print(student_object.errors)
        return {
            'status': 'failure',
            'message': 'Student Profile creation failed',
        }


def create_student_full_profile_list(data):

    success_number = 0

    for student in data:
        response = create_student_full_profile(student)
        if response['status'] == 'success':
            success_number += 1

    return {
        'message': 'Added ' + str(success_number) + ' students in school'
    }


def get_student_full_profile(student_section_object):

    student_object = student_section_object.parentStudent

    student_data = {}
    if student_object.profileImage:
        student_data['profileImage'] = student_object.profileImage.url
    else:
        student_data['profileImage'] = None
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
    student_data['bankIfscCode'] = student_object.bankIfscCode
    student_data['bankAccountNum'] = student_object.bankAccountNum
    student_data['aadharNum'] = student_object.aadharNum
    student_data['bloodGroup'] = student_object.bloodGroup
    student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome
    student_data['rte'] = student_object.rte
    student_data['parentTransferCertificate'] = student_object.parentTransferCertificate_id

    if student_object.currentBusStop is not None:
        student_data['busStopDbId'] = student_object.currentBusStop.id
    else:
        student_data['busStopDbId'] = None

    if student_object.admissionSession is not None:
        student_data['admissionSessionDbId'] = student_object.admissionSession.id
    else:
        student_data['admissionSessionDbId'] = None

    student_data['dateOfAdmission'] = student_object.dateOfAdmission

    student_data['sectionDbId'] = student_section_object.parentDivision.id
    student_data['sectionName'] = student_section_object.parentDivision.name
    student_data['className'] = student_section_object.parentClass.name
    student_data['classDbId'] = student_section_object.parentClass.id

    return student_data


def get_student_full_profile_by_session_id(data):

    student_section_object = \
        StudentSection.objects.get(parentStudent_id=data['studentDbId'],
                                   parentSession_id=data['sessionDbId'])

    return get_student_full_profile(student_section_object)


def get_student_full_profile_by_school_and_session_id(data):

    student_list = []

    for student_section_object in \
        StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                      parentSession_id=data['sessionDbId']) \
        .order_by('parentClass__orderNumber', 'parentDivision__orderNumber', 'parentStudent__name') \
        .select_related('parentStudent', 'parentClass', 'parentDivision'):

        student_list.append(get_student_full_profile(student_section_object))

    return student_list
