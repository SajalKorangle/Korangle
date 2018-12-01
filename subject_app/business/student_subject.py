from subject_app.models import StudentSubject

from rest_framework import serializers


class StudentSubjectModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubject
        fields = '__all__'


def create_student_subject(data):
    student_subject_serializer = StudentSubjectModelSerializer(data=data)
    if student_subject_serializer.is_valid():
        student_subject_serializer.save()
        return student_subject_serializer.data
    else:
        return 'Subject addition for student failed'


def delete_student_subject(data):
    StudentSubject.objects.get(id=data).delete()

    return 'Subject removed for student successfully'


def get_student_subject_list(data):

    student_subject_list = []

    if 'studentId' in data:
        student_subject_query = StudentSubject.objects.filter(parentSession_id=data['sessionId'],
                                                              parentStudent_id=data['studentId'])
    else:
        student_subject_query = StudentSubject.objects.filter(parentSession_id=data['sessionId'],
                                                              parentStudent__parentSchool_id=data['schoolId'])

    for student_subject_object in student_subject_query:
        student_subject_list.append(StudentSubjectModelSerializer(student_subject_object).data)

    return student_subject_list


def create_student_subject_list(data):

    return_data = []

    for student_subject_data in data:
        return_data.append(create_student_subject(student_subject_data))

    return return_data


def delete_student_subject_list(data):

    for student_subject_id in data.split(','):
        StudentSubject.objects.get(id=student_subject_id).delete()

    return 'Subject removed from multiple students successfully'


