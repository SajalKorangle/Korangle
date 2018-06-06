
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

        student_section_object = StudentSection(parentStudent_id=student_data['dbId'],
                                                parentSection_id=data['sectionDbId'])
        student_section_object.save()

        initialize_student_fees(student_section_object.parentStudent,
                                student_section_object.parentSection.parentClassSession.parentSession)
