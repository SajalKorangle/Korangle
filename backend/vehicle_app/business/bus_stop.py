
from school_app.model.models import BusStop

from rest_framework import serializers


class BusStopModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusStop
        fields = '__all__'


def get_bus_stop_list(data):

    bus_stop_list = []

    for bus_stop_object in \
            BusStop.objects.filter(parentSchool_id=data['parentSchool']).order_by('kmDistance'):
        bus_stop_list.append(BusStopModelSerializer(bus_stop_object).data)

    return bus_stop_list


def create_bus_stop(data):

    if BusStop.objects.filter(stopName=data['stopName'], parentSchool_id=data['parentSchool']).count() > 0:
        return {
            'status': 'failure',
            'message': 'Bus Stop Name: ' + data['stopName'] + ' already exists',
        }

    bus_stop_object = BusStopModelSerializer(data=data)
    if bus_stop_object.is_valid():
        bus_stop_object.save()
        return {
            'status': 'success',
            'message': 'Bus Stop added successfully',
        }
    else:
        return {
            'status': 'failure',
            'message': 'Bus Stop creation failed',
        }


def update_bus_stop(data):

    if BusStop.objects.exclude(id=data['id'])\
            .filter(stopName=data['stopName'], parentSchool_id=data['parentSchool']).count() > 0:
        return {
            'status': 'failure',
            'message': 'Bus Stop Name: ' + data['stopName'] + ' already exists for some other bus stop',
        }

    bus_stop_serializer = BusStopModelSerializer(BusStop.objects.get(id=data['id']), data=data)
    if bus_stop_serializer.is_valid():
        bus_stop_serializer.save()
        return {
            'status': 'success',
            'message': 'Bus Stop updated successfully',
        }
    else:
        return {
            'status': 'failure',
            'message': 'Bus Stop updation failed',
        }


def delete_bus_stop(data):

    try:
        BusStop.objects.get(id=data['id']).delete()
        return {
            'status': 'success',
            'message': 'Bus Stop deleted successfully',
        }
    except:
        return {
            'status': 'failure',
            'message': 'Bus Stop deletion failed',
        }
