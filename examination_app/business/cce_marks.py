
from examination_app.models import CCEMarks as Model

from rest_framework import serializers


class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'


def get_cce_marks_list(data):

    query = Model.objects.all()

    if 'studentList' in data and data['studentList'] != '':
        query = query.filter(parentStudent__in=data['studentList'].split(','))

    if 'sessionList' in data and data['sessionList'] != '':
        query = query.filter(parentSession__in=data['sessionList'].split(','))

    if 'marksObtainedList' in data and data['marksObtainedList'] != '':
        query = query.filter(marksObtained__in = data['marksObtainedList'].split(','))

    list = []

    for object in query:
        list.append(ModelSerializer(object).data)

    return list


def create_cce_marks_list(data):

    return_data = []

    for object_data in data:
        return_data.append(create_cce_marks(object_data))

    print(return_data)

    return return_data


def create_cce_marks(data):
    serializer = ModelSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'CCE Marks addition failed'


def update_cce_marks_list(data):

    return_data = []

    for object_data in data:
        return_data.append(update_cce_marks(object_data))

    return return_data


def update_cce_marks(data):

    serializer = ModelSerializer(Model.objects.get(id=data['id']), data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'CCE Marks updation failed'


def delete_cce_marks_list(data):

    if data is not None:
        Model.objects.filter(id__in=data.split(',')).delete()

    return 'CCE Marks removed successfully'

