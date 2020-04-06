
from subject_app.models import ExtraSubField as Model

from rest_framework import serializers


class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'


def get_extra_sub_field_list(data):

    query = Model.objects.all()

    if 'nameList' in data and data['nameList'] != '':
        query = query.filter(name__in=data['nameList'].split(','))

    if 'extraFieldList' in data and data['extraFieldList'] != '':
        query = query.filter(parentExtraField__in=data['extraFieldList'].split(','))

    list = []

    for object in query:
        list.append(ModelSerializer(object).data)

    return list
