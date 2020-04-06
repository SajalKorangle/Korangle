
from school_app.model.models import BusStop

def get_bus_stops(data):

    bus_stop_list = []

    for bus_stop_object in BusStop.objects.filter(parentSchool_id=data['schoolDbId']).order_by('kmDistance'):
        temp_bus_stop = {}
        temp_bus_stop['dbId'] = bus_stop_object.id
        temp_bus_stop['stopName'] = bus_stop_object.stopName
        temp_bus_stop['kmDistance'] = bus_stop_object.kmDistance
        bus_stop_list.append(temp_bus_stop)

    return bus_stop_list