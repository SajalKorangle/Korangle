
from examination_app.models import Examination

from rest_framework import serializers


class ExaminationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = '__all__'


def get_examination_list(data):

    examination_list = []

    if 'sessionId' in data:

        for examination_object in Examination.objects.filter(parentSchool_id=data['schoolId'],
                                                             parentSession_id=data['sessionId']):
            examination_list.append(ExaminationModelSerializer(examination_object).data)
    else:

        query = Examination.objects.all()

        if 'idList' in data and data['idList'] != '':
            query = query.filter(id__in=data['idList'].split(','))

        if 'nameList' in data and data['nameList'] != '':
            query = query.filter(parentExamination__in=data['examinationList'].split(','))

        if 'schoolList' in data and data['schoolList'] != '':
            query = query.filter(parentSchool__in=data['schoolList'].split(','))

        if 'sessionList' in data and data['sessionList'] != '':
            query = query.filter(parentSession__in=data['sessionList'].split(','))

        if 'statusList' in data and data['statusList'] != '':
            query = query.filter(status__in=data['statusList'].split(','))

        for object in query:
            examination_list.append(ExaminationModelSerializer(object).data)

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


