
from parent_test import ParentTestCase

from class_app.handlers.classes import get_class_list

from class_app.models import Class

class ClassesTestCase(ParentTestCase):

    def test_get_class_list(self):

        response = get_class_list()

        class_list_queryset = Class.objects.all().order_by('orderNumber')

        self.assertEqual(len(response), class_list_queryset.count())

        index = 0

        for class_object in class_list_queryset:

            self.assertEqual(response[index]['name'], class_object.name)
            self.assertEqual(response[index]['dbId'], class_object.id)

            index += 1

