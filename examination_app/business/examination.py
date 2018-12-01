
from examination_app.models import Examination

from rest_framework import serializers


class ExaminationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = '__all__'


def get_examination_list(data):

    examination_list = []

    for examination_object in Examination.objects.filter(parentSchool_id=data['schoolId'],
                                                         parentSession_id=data['sessionId']):
        examination_list.append(ExaminationModelSerializer(examination_object).data)

    return examination_list


def create_examination(data):

    examination_serializer = ExaminationModelSerializer(data=data)
    if examination_serializer.is_valid():
        examination_serializer.save()
        return examination_serializer.data
    else:
        return 'Examination creation failed'


def update_examination(data):

    examination_serializer = ExaminationModelSerializer(Examination.objects.get(id=data['id']), data=data)
    if examination_serializer.is_valid():
        examination_serializer.save()
        return examination_serializer.data
    else:
        return 'Examination updation failed'


