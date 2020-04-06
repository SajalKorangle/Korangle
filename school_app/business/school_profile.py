
from school_app.model.models import School

from datetime import date, timedelta

from rest_framework import serializers


class SchoolModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


def create_school_profile(data):

    data['dateOfExpiration'] = date.today() + timedelta(10)

    school_serializer = SchoolModelSerializer(data=data)
    if school_serializer.is_valid():
        school_serializer.save()
        return {
            'id': school_serializer.data['id'],
            'message': 'School created successfully',
        }
    else:
        return 'School creation failed'

