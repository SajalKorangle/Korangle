
from examination_app.models import MpBoardReportCardMapping as Model

from rest_framework import serializers


class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'


def get_mp_board_report_card_mapping(data):

    query = Model.objects.all()

    if 'parentSession' in data and data['parentSession'] != '':
        query = query.filter(parentSession=data['parentSession'])

    if 'parentSchool' in data and data['parentSchool'] != '':
        query = query.filter(parentSchool=data['parentSchool'])

    if (query.count() > 0):
        return ModelSerializer(query[0]).data
    else:
        return None


def create_mp_board_report_card_mapping(data):
    serializer = ModelSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'Setting Report Card failed'


def update_mp_board_report_card_mapping(data):

    serializer = ModelSerializer(Model.objects.get(id=data['id']), data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'Setting Report Card failed'
