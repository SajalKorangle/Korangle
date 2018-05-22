
from parent_test import ParentTestCase

# Factories
from school_app.factory.school import SchoolFactory
from team_app.factory.member import MemberFactory
from team_app.factory.module import ModuleFactory
from team_app.factory.access import AccessFactory
from team_app.factory.permission import PermissionFactory

# Models
from django.contrib.auth.models import User
from team_app.models import Member, Task, Permission

# Business
from team_app.business.member import get_school_member_list, create_member, delete_member


class MemberTestCase(ParentTestCase):

    def test_delete_member(self):

        school_object = SchoolFactory()
        user_object = User.objects.get(username='harshal')

        module_list = []

        module_list.extend(ModuleFactory.create_batch(3))

        member_object = MemberFactory(parentSchool=school_object, parentUser=user_object)

        for module in module_list:
            for task_object in Task.objects.filter(parentModule=module):
                PermissionFactory(parentTask=task_object,
                                  parentSchool=school_object,
                                  parentUser=user_object)

        data = {
            'dbId': member_object.id,
        }

        delete_member(data)

        self.assertEqual(Permission.objects.filter(parentSchool=school_object, parentUser=user_object).count(), 0)
        self.assertEqual(Member.objects.filter(parentSchool=school_object, parentUser=user_object).count(), 0)

    def test_create_member(self):

        user_object = User.objects.get(username='harshal')

        school_object = SchoolFactory()

        module_list = []

        module_list.extend(ModuleFactory.create_batch(3))

        for module in module_list:
            AccessFactory(parentModule=module, parentSchool=school_object)

        data = {
            'schoolDbId': school_object.id,
            'userDbId': user_object.id,
            'permissionList': [],
        }

        for module in module_list:
            for task_object in Task.objects.filter(parentModule=module):
                permission = {
                    'taskDbId': task_object.id
                }
                data['permissionList'].append(permission)

        create_member(data)

        Member.objects.get(parentSchool_id=data['schoolDbId'], parentUser_id=data['userDbId'])

        self.assertEqual(Permission.objects.filter(parentSchool_id=data['schoolDbId'],
                                                   parentUser_id=data['userDbId']).count(), 9)

    def test_get_school_member_list(self):

        school_object = SchoolFactory()
        MemberFactory(parentSchool=school_object, parentUser=User.objects.get(username='harshal'))
        MemberFactory(parentSchool=school_object, parentUser=User.objects.get(username='arnava'))
        MemberFactory(parentSchool=school_object, parentUser=User.objects.get(username='nainish'))

        data = {
            'schoolDbId': school_object.id,
        }

        response = get_school_member_list(data)

        self.assertEqual(len(response), 3)

        self.assertEqual(response[0]['username'], 'arnava')
        self.assertEqual(response[1]['username'], 'harshal')
        self.assertEqual(response[2]['username'], 'nainish')

