from parent_test import ParentTestCase

from school_app.model.models import BusStop

from school_app.handlers.bus_stops import get_bus_stops

class BusStopTestCase(ParentTestCase):

    def test_get_bus_stops(self):

        school_object = BusStop.objects.all()[0].parentSchool

        data = {}
        data['schoolDbId'] = school_object.id

        bus_stop_list = get_bus_stops(data)

        bus_stop_queryset = BusStop.objects.filter(parentSchool=school_object).order_by('kmDistance')

        self.assertEqual(len(bus_stop_list), bus_stop_queryset.count())

        indexCounter = 0
        for bus_stop_object in bus_stop_queryset:

            self.assertEqual(bus_stop_list[indexCounter]['stopName'], bus_stop_object.stopName)
            self.assertEqual(bus_stop_list[indexCounter]['dbId'], bus_stop_object.id)
            self.assertEqual(bus_stop_list[indexCounter]['kmDistance'], bus_stop_object.kmDistance)

            indexCounter += 1