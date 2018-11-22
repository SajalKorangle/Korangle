
from team_app.models import Access

from rest_framework import serializers


class AccessModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Access
        fields = '__all__'


def create_access(data):

    access_serializer = AccessModelSerializer(data=data)
    if access_serializer.is_valid():
        access_serializer.save()
        return {
            'id': access_serializer.data['id'],
            'message': 'Access given successfully',
        }
    else:
        return 'Access creation failed'


def create_access_batch(data):

    for access_data in data:
        create_access(access_data)

    return 'Access given successfully'
