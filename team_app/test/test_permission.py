
from parent_test import ParentTestCase

# Factories
from school_app.factory.school import SchoolFactory
from team_app.factory.module import ModuleFactory
from team_app.factory.permission import PermissionFactory

# Models
from django.contrib.auth.models import User
from team_app.models import Task, Permission

# Business
from team_app.business.permission import get_school_member_permission_list, update_permissions


class PermissionTestCase(ParentTestCase):

    def test_update_permissions(self):

        school_object = SchoolFactory()

        module_list = []

        module_list.extend(ModuleFactory.create_batch(3))

        taskDbId = 0
        for module in module_list:
            for task_object in Task.objects.filter(parentModule=module):
                PermissionFactory(parentTask=task_object,
                                  parentSchool=school_object,
                                  parentUser=User.objects.get(username='harshal'))
                taskDbId = task_object.id

        data = {
            'schoolDbId': school_object.id,
            'userDbId': User.objects.get(username='harshal').id,
            'permissionList': [
                { 'taskDbId': taskDbId },
            ],
        }

        response = update_permissions(data)

        permission_queryset = Permission.objects.filter(parentSchool=school_object, parentUser__username='harshal')

        self.assertEqual(permission_queryset.count(), 1)

        self.assertEqual(permission_queryset[0].parentTask.id, taskDbId)

    def test_get_school_member_permission_list(self):

        school_object = SchoolFactory()

        module_list = []

        module_list.extend(ModuleFactory.create_batch(3))

        for module in module_list:
            for task_object in Task.objects.filter(parentModule=module):
                PermissionFactory(parentTask=task_object,
                                  parentSchool=school_object,
                                  parentUser=User.objects.get(username='harshal'))

        data = {
            'schoolDbId': school_object.id,
            'userDbId': User.objects.get(username='harshal').id,
        }

        response = get_school_member_permission_list(data)

        self.assertEqual(len(response), 9)

        index = 0
        for module in module_list:
            for task_object in Task.objects.filter(parentModule=module).order_by('orderNumber'):
                self.assertEqual(response[index]['taskDbId'], task_object.id)
                index += 1

