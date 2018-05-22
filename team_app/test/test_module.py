
from parent_test import ParentTestCase

# Factories
from school_app.factory.school import SchoolFactory
from team_app.factory.module import ModuleFactory
from team_app.factory.access import AccessFactory

# Models
from django.contrib.auth.models import User
from team_app.models import Member

# Business
from team_app.business.module import get_school_module_list, get_module_by_object


class ModuleTestCase(ParentTestCase):

    def test_get_module_by_object(self):

        module_object = ModuleFactory()

        response = get_module_by_object(module_object)

        self.assertEqual(len(response), 5)

        self.assertEqual(response['dbId'], module_object.id)
        self.assertEqual(response['path'], module_object.path)
        self.assertEqual(response['title'], module_object.title)
        self.assertEqual(response['icon'], module_object.icon)
        self.assertEqual(len(response['taskList']), module_object.task_set.all().count())

        index = 0
        for task_object in module_object.task_set.all().order_by('orderNumber'):
            task_response = response['taskList'][index]
            self.assertEqual(task_response['dbId'], task_object.id)
            self.assertEqual(task_response['path'], task_object.path)
            self.assertEqual(task_response['title'], task_object.title)
            index += 1

    def test_get_school_module_list(self):

        school_object = SchoolFactory()

        module_list = []

        module_list.extend(ModuleFactory.create_batch(3))

        for module in module_list:
            AccessFactory(parentModule=module, parentSchool=school_object)

        data = {
            'schoolDbId': school_object.id,
        }

        response = get_school_module_list(data)

        self.assertEqual(len(response), 3)

        self.assertEqual(response[0]['dbId'], module_list[0].id)
        self.assertEqual(response[1]['dbId'], module_list[1].id)
        self.assertEqual(response[2]['dbId'], module_list[2].id)

