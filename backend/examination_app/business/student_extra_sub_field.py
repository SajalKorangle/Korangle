
from examination_app.models import StudentExtraSubField

from rest_framework import serializers


class StudentExtraSubFieldModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExtraSubField
        fields = '__all__'


def get_student_extra_sub_field_list(data):

    query = StudentExtraSubField.objects.all()

    if 'studentList' in data and data['studentList'] != '':
        query = query.filter(parentStudent__in=data['studentList'].split(','))

    if 'examinationList' in data and data['examinationList'] != '':
        query = query.filter(parentExamination__in=data['examinationList'].split(','))

    if 'extraSubFieldList' in data and data['extraSubFieldList'] != '':
        query = query.filter(parentExtraSubField__in=data['extraSubFieldList'].split(','))

    if 'marksObtainedList' in data and data['marksObtainedList'] != '':
        query = query.filter(marksObtained__in = data['marksObtainedList'].split(','))

    list = []

    for object in query:
        list.append(StudentExtraSubFieldModelSerializer(object).data)

    return list


def create_student_extra_sub_field_list(data):

    return_data = []

    for student_extra_sub_field_data in data:
        return_data.append(create_student_extra_sub_field(student_extra_sub_field_data))

    return return_data


def create_student_extra_sub_field(data):
    student_extra_sub_field_serializer = StudentExtraSubFieldModelSerializer(data=data)
    if student_extra_sub_field_serializer.is_valid():
        student_extra_sub_field_serializer.save()
        return student_extra_sub_field_serializer.data
    else:
        return 'Extra Sub Field addition for student failed'


def update_student_extra_sub_field_list(data):

    return_data = []

    for student_extra_sub_field_data in data:
        return_data.append(update_student_extra_sub_field(student_extra_sub_field_data))

    return return_data


def update_student_extra_sub_field(data):

    serializer = StudentExtraSubFieldModelSerializer(StudentExtraSubField.objects.get(id=data['id']), data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'Student Extra Sub Field updation failed'
