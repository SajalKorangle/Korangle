
from student_app.models import StudentSection

from fee_second_app.business.initialize_student_fees import initialize_student_fees

from rest_framework import serializers


class StudentSectionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSection
        fields = '__all__'


def update_student_section(data):

    student_section_object = StudentSectionModelSerializer(StudentSection.objects.get(id=data['id']), data=data)
    if student_section_object.is_valid():
        student_section_object.save()
        return {'status': 'success', 'message': 'Class updated successfully'}
    else:
        return {'status': 'failure', 'message': 'Class updation failed'}


def create_student_section_list(data):

    for student_data in data['studentList']:

        data = {
            'parentStudent': student_data['dbId'],
            'parentDivision': data['sectionDbId'],
            'parentClass': student_data['classDbId'],
            'parentSession': student_data['parentSession'],
            'rollNumber': None,
        }

        create_student_section(data)

        '''student_section_object = StudentSection(parentStudent_id=student_data['dbId'],
                                                parentDivision_id=data['sectionDbId'],
                                                parentClass_id=)
        student_section_object.save()

        initialize_student_fees(student_section_object.parentStudent,
                                student_section_object.parentSession)'''


def create_student_section(data):

    student_section_serializer = StudentSectionModelSerializer(data=data)
    if student_section_serializer.is_valid():
        student_section_serializer.save()
        student_section_object = StudentSection.objects.get(id=student_section_serializer.data['id'])
        initialize_student_fees(student_section_object.parentStudent,
                                student_section_object.parentSession)
        return {
            'status': 'success',
            'message': 'Student added in class successfully',
        }
    else:
        print(student_section_serializer.errors)
        return {
            'status': 'failure',
            'message': 'Student addition in class failed',
        }
