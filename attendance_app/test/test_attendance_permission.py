
from parent_test import ParentTestCase

# Factory
from school_app.factory.school import SchoolFactory
from attendance_app.factory.attendance_permission import AttendancePermissionFactory

# Business
from attendance_app.business.attendance_permission \
    import get_attendance_permission_list, create_attendance_permission, delete_attendance_permission

# Model
from attendance_app.models import AttendancePermission
from school_app.model.models import Session
from class_app.models import Section
from django.contrib.auth.models import User


class AttendancePermissionTestCase(ParentTestCase):

    def test_get_attendance_permission_list(self):

        school_object = SchoolFactory()
        user_Object = User.objects.all()[0]

        attendance_permission_list = []

        attendance_permission_list.append(
            AttendancePermissionFactory(parentSchool=school_object,
                                        parentUser=user_Object,
                                        parentSection=Section.objects.get(name='Section - A',
                                                                          parentClassSession__parentClass__name='Class - 12',
                                                                          parentClassSession__parentSession__name='Session 2017-18')))

        attendance_permission_list.append(
            AttendancePermissionFactory(parentSchool=school_object,
                                        parentUser=user_Object,
                                        parentSection=Section.objects.get(name='Section - B',
                                                                          parentClassSession__parentClass__name='Class - 12',
                                                                          parentClassSession__parentSession__name='Session 2017-18')))

        data = {
            'parentSchool': school_object.id,
            'parentUser': user_Object.id,
            'sessionId': Session.objects.get(name='Session 2017-18'),
        }

        response = get_attendance_permission_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for attendance_permission in attendance_permission_list:
            attendance_permission_response = response[index]
            self.assertEqual(attendance_permission_response['id'], attendance_permission.id)
            index += 1

    def test_create_attendance_permission(self):

        school_object = SchoolFactory()
        user_object = User.objects.all()[0]
        seciton_object = Section.objects.get(name='Section - A',
                                             parentClassSession__parentClass__name='Class - 12',
                                             parentClassSession__parentSession__name='Session 2017-18')

        data = {
            'parentSchool': school_object.id,
            'parentUser': user_object.id,
            'parentSection': seciton_object.id,
        }

        create_attendance_permission(data)

        AttendancePermission.objects.get(parentSchool_id=data['parentSchool'],
                                         parentUser_id=data['parentUser'],
                                         parentSection_id=data['parentSection'])

    def test_delete_attendance_permission(self):

        attendance_permission_object = AttendancePermissionFactory()

        data = {
            'id': attendance_permission_object.id
        }

        delete_attendance_permission(data)

        self.assertEqual(AttendancePermission.objects.filter(id=data['id']).count(),0)