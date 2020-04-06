
from parent_test import ParentTestCase

# Factory
from school_app.factory.school import SchoolFactory
from vehicle_app.factory.bus_stop import BusStopFactory

# Business
from vehicle_app.business.bus_stop \
    import get_bus_stop_list, create_bus_stop, delete_bus_stop, BusStopModelSerializer, update_bus_stop

# Model
from school_app.model.models import BusStop


class BusStopTestCase(ParentTestCase):

    def test_get_bus_stop_list(self):

        school_object = SchoolFactory()

        bus_stop_list = []

        bus_stop_list.extend(BusStopFactory.create_batch(3, parentSchool=school_object))

        data = {
            'parentSchool': school_object.id,
        }

        response = get_bus_stop_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for bus_stop in bus_stop_list:
            bus_stop_response = response[index]
            self.assertEqual(bus_stop_response['parentSchool'], school_object.id)
            self.assertEqual(bus_stop_response['id'], bus_stop.id)
            index += 1

    def test_create_bus_stop(self):

        school_object = SchoolFactory()

        data = {
            'stopName': 'Dummy',
            'kmDistance': 4.5,
            'parentSchool': school_object.id,
        }

        create_bus_stop(data)

        BusStop.objects.get(stopName=data['stopName'],
                            kmDistance=data['kmDistance'],
                            parentSchool_id=data['parentSchool'])

    def test_update_bus_stop(self):

        bus_stop_object = BusStopFactory()

        bus_stop_serializer = BusStopModelSerializer(bus_stop_object)

        data = bus_stop_serializer.data

        data['stopName'] = 'okay now'

        update_bus_stop(data)

        self.assertEqual(BusStop.objects.get(id=bus_stop_serializer.data['id']).stopName, 'okay now')

    def test_delete_bus_stop(self):

        bus_stop_object = BusStopFactory()

        data = {
            'id': bus_stop_object.id
        }

        delete_bus_stop(data)

        self.assertEqual(BusStop.objects.filter(id=data['id']).count(),0)
