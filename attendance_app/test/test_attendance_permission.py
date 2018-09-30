
from parent_test import ParentTestCase

# Factory
from attendance_app.factory.attendance_permission import AttendancePermissionFactory
from employee_app.factory.employee import EmployeeFactory

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

        employee_object = EmployeeFactory()

        attendance_permission_list = []

        attendance_permission_list.append(
            AttendancePermissionFactory(parentEmployee=employee_object,
                                        parentSection=Section.objects.get(name='Section - A',
                                                                          parentClassSession__parentClass__name='Class - 12',
                                                                          parentClassSession__parentSession__name='Session 2017-18')))

        attendance_permission_list.append(
            AttendancePermissionFactory(parentEmployee=employee_object,
                                        parentSection=Section.objects.get(name='Section - B',
                                                                          parentClassSession__parentClass__name='Class - 12',
                                                                          parentClassSession__parentSession__name='Session 2017-18')))

        data = {
            'parentEmployee': employee_object.id,
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

        employee_object = EmployeeFactory()
        seciton_object = Section.objects.get(name='Section - A',
                                             parentClassSession__parentClass__name='Class - 12',
                                             parentClassSession__parentSession__name='Session 2017-18')

        data = {
            'parentEmployee': employee_object.id,
            'parentSection': seciton_object.id,
        }

        create_attendance_permission(data)

        AttendancePermission.objects.get(parentEmployee_id=data['parentEmployee'],
                                         parentSection_id=data['parentSection'])

    def test_delete_attendance_permission(self):

        attendance_permission_object = AttendancePermissionFactory()

        data = {
            'id': attendance_permission_object.id
        }

        delete_attendance_permission(data)

        self.assertEqual(AttendancePermission.objects.filter(id=data['id']).count(),0)