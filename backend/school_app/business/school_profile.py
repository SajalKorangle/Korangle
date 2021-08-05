
from school_app.model.models import School

from datetime import datetime, timedelta

from rest_framework import serializers


class SchoolModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


def create_school_profile(data):

    data['expired'] = False
    data['dateOfCreation'] = datetime.now().strftime("%Y-%m-%d")
    data['dateOfExpiry'] = (datetime.now() + timedelta(days=29)).strftime("%Y-%m-%d")

    school_serializer = SchoolModelSerializer(data=data)
    if school_serializer.is_valid():
        school_serializer.save()
        return {
            'id': school_serializer.data['id'],
            'message': 'School created successfully',
        }
    else:
        return 'School creation failed'

