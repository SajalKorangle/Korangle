from attendance_app.business.employee_attendance import get_employee_attendance_list, \
    create_or_update_employee_attendance_list, delete_employee_attendance_list
from attendance_app.factory.employee_attendance import EmployeeAttendanceFactory
from parent_test import ParentTestCase

from attendance_app.models import EmployeeAttendance, ABSENT_ATTENDANCE_STATUS, \
    PRESENT_ATTENDANCE_STATUS

from employee_app.factory.employee import EmployeeFactory


class EmployeeAttendanceTestCase(ParentTestCase):

    def test_get_employee_attendance_list(self):

        employee_list = []
        employee_list.extend(EmployeeFactory.create_batch(3))

        for employee in employee_list:
            EmployeeAttendanceFactory(parentEmployee_id=employee.id)

        employee_id_list = str(employee_list[0].id) + ',' + str(employee_list[1].id) + ',' + str(employee_list[2].id)

        data = {
            'employeeIdList': employee_id_list,
            'startDate': '2011-01-01',
            'endDate': '2011-01-01',
        }

        response = get_employee_attendance_list(data)

        self.assertEqual(response.__len__(), 3)

        index = 0
        for response_data in response:
            response_data['parentEmployee'] = employee_list[index].id
            response_data['dateOfAttenance'] = '2011-01-01'
            response_data['status'] = ABSENT_ATTENDANCE_STATUS

    def test_create_or_update_employee_attendance_list(self):

        employee_object_one = EmployeeFactory()
        employee_object_two = EmployeeFactory()

        data_list = [
            {
                'parentEmployee': employee_object_one.id,
                'dateOfAttendance': '2016-01-01',
                'status': PRESENT_ATTENDANCE_STATUS
            },
            {
                'parentEmployee': employee_object_two.id,
                'dateOfAttendance': '2016-01-01',
                 'status': PRESENT_ATTENDANCE_STATUS
            }
        ]

        create_or_update_employee_attendance_list(data_list)

        object_one = EmployeeAttendance.objects.get(parentEmployee_id=data_list[0]['parentEmployee'],
                                                   dateOfAttendance=data_list[0]['dateOfAttendance'])
        self.assertEqual(object_one.status, data_list[0]['status'])

        object_two = EmployeeAttendance.objects.get(parentEmployee_id=data_list[1]['parentEmployee'],
                                                   dateOfAttendance=data_list[1]['dateOfAttendance'])
        self.assertEqual(object_two.status, data_list[1]['status'])

    def test_delete_employee_attendance_list(self):

        employee_list = []
        employee_list.extend(EmployeeFactory.create_batch(3))

        for employee in employee_list:
            EmployeeAttendanceFactory(parentEmployee_id=employee.id)

        employee_id_list = str(employee_list[0].id) + ',' + str(employee_list[1].id) + ',' + str(employee_list[2].id)

        data = {
            'employeeIdList': employee_id_list,
            'startDate': '2011-01-01',
            'endDate': '2011-01-01',
        }

        delete_employee_attendance_list(data)

        for employee_id in employee_id_list.split(','):
            self.assertEqual(EmployeeAttendance.objects.filter(parentEmployee_id=int(employee_id),
                                                              dateOfAttendance__gte=data['startDate'],
                                                              dateOfAttendance__lte=data['endDate']).count(), 0)
