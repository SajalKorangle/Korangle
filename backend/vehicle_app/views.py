from decorators import user_permission

from rest_framework.views import APIView

import json


############## Bus Stop ##############
from .business.bus_stop import create_bus_stop, get_bus_stop_list, delete_bus_stop, update_bus_stop


class BusStopView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_bus_stop(data)

    @user_permission
    def put(request, bus_stop_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_bus_stop(data)

    @user_permission
    def delete(request, bus_stop_id):
        data = {
            'id': bus_stop_id,
        }
        return delete_bus_stop(data)


class BusStopListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_bus_stop_list(data)
