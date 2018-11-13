
from class_app.models import Division

from rest_framework import serializers


class SectionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'


def get_section_list():

    section_list = []

    for section_object in Division.objects.all().order_by('orderNumber'):

        section_list.append(SectionModelSerializer(section_object).data)

    return section_list