
from student_app.models import StudentSection

from fee_second_app.business.initialize_student_fees import initialize_student_fees

from rest_framework import serializers


class StudentSectionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSection
        fields = '__all__'


def get_student_section_list(data):

    student_section_query = StudentSection.objects.all()

    if data['studentList'] != '':
        student_list = data['studentList'].split(',')
        student_section_query = student_section_query.filter(parentStudent__in=student_list)

    if data['sessionList'] != '':
        session_list = data['sessionList'].split(',')
        student_section_query = student_section_query.filter(parentSession__in=session_list)

    if data['classList'] != '':
        class_list = data['classList'].split(',')
        student_section_query = student_section_query.filter(parentClass__in=class_list)

    if data['sectionList'] != '':
        section_list = data['sectionList'].split(',')
        student_section_query = student_section_query.filter(parentDivision__in=section_list)

    if data['rollNumberList'] != '':
        roll_number_list = data['rollNumberList'].split(',')
        student_section_query = student_section_query.filter(rollNumber__in=roll_number_list)

    if data['attendanceList'] != '':
        attendance_list = data['attendanceList'].split(',')
        student_section_query = student_section_query.filter(attendance__in=attendance_list)

    student_section_list = []

    for student_object in student_section_query:
        student_section_list.append(StudentSectionModelSerializer(student_object).data)

    return student_section_list


def update_student_section(data):

    student_section_object = StudentSectionModelSerializer(StudentSection.objects.get(id=data['id']), data=data)
    if student_section_object.is_valid():
        student_section_object.save()
        return {'status': 'success', 'message': 'Class updated successfully'}
    else:
        return {'status': 'failure', 'message': 'Class updation failed'}


def create_student_section_list(data):

    for student_data in data['studentList']:

        student_section = {
            'parentStudent': student_data['dbId'],
            'parentDivision': data['sectionDbId'],
            'parentClass': data['classDbId'],
            'parentSession': data['parentSession'],
            'rollNumber': None,
        }

        create_student_section(student_section)

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
