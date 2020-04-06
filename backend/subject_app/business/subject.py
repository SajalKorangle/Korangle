
from subject_app.models import SubjectSecond

from rest_framework import serializers


class SubjectSecondModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectSecond
        fields = '__all__'


def get_subject_list():

    subject_list = []

    for subject_object in SubjectSecond.objects.all().order_by('name'):
        subject_list.append(SubjectSecondModelSerializer(subject_object).data)

    return subject_list
