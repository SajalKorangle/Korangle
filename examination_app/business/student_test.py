
from examination_app.models import StudentTest

from rest_framework import serializers


class StudentTestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTest
        fields = '__all__'


def get_student_test_list(data):

    student_test_query = StudentTest.objects.all()

    if data['studentList'] != '':
        student_test_query = student_test_query.filter(parentStudent__in=data['studentList'].split(','))

    if data['subjectList'] != '':
        student_test_query = student_test_query.filter(parentSubject__in=data['subjectList'].split(','))

    if data['examinationList'] != '':
        student_test_query = student_test_query.filter(parentExamination__in=data['examinationList'].split(','))

    if data['marksObtainedList'] != '':
        student_test_query = student_test_query.filter(marksObtained__in = data['marksObtainedList'].split(','))

    if data['testTypeList'] != '':
        student_test_query = student_test_query.filter(testType__in = data['testTypeList'].split(','))

    student_test_list = []

    for student_test_object in student_test_query:
        student_test_list.append(StudentTestModelSerializer(student_test_object).data)

    return student_test_list


def create_student_test_list(data):

    return_data = []

    print(data)

    for student_test_data in data:
        return_data.append(create_student_test(student_test_data))

    return return_data


def create_student_test(data):
    student_test_serializer = StudentTestModelSerializer(data=data)
    if student_test_serializer.is_valid():
        student_test_serializer.save()
        return student_test_serializer.data
    else:
        return 'Test addition for student failed'


def update_student_test_list(data):

    return_data = []

    for student_test_data in data:
        return_data.append(update_student_test(student_test_data))

    return return_data

def update_student_test(data):

    student_test_serializer = StudentTestModelSerializer(StudentTest.objects.get(id=data['id']), data=data)
    if student_test_serializer.is_valid():
        student_test_serializer.save()
        return student_test_serializer.data
    else:
        return 'Employee Profile updation failed'





def delete_student_test_list(data):

    if data is not None:
        StudentTest.objects.filter(id__in=data.split(',')).delete()

    return 'Test removed from multiple students successfully'

