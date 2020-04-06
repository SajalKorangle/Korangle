
from parent_test import ParentTestCase

# Factory
from attendance_app.factory.employee_applied_leave import EmployeeAppliedLeaveFactory
from employee_app.factory.employee import EmployeeFactory

# Business
from attendance_app.business.employee_applied_leave \
    import get_employee_applied_leave_list, create_employee_applied_leave_list, update_employee_applied_leave_list

# Model
from attendance_app.models import EmployeeAppliedLeave, PENDING_LEAVE_STATUS, APPROVED_LEAVE_STATUS


class EmployeeAppliedLeaveTestCase(ParentTestCase):

    def test_get_employee_applied_leave_list(self):

        employee_object_one = EmployeeFactory()
        employee_object_two = EmployeeFactory()

        employee_applied_leave_list = []

        employee_applied_leave_list.append(EmployeeAppliedLeaveFactory(parentEmployee=employee_object_one,
                                                                       dateOfLeave='2018-01-01',
                                                                       halfDay=True))
        employee_applied_leave_list.append(EmployeeAppliedLeaveFactory(parentEmployee=employee_object_two,
                                                                       dateOfLeave='2018-01-02'))

        data = {
            'employeeIdList': str(employee_object_one.id) + ',' + str(employee_object_two.id),
            'startDate': '2018-01-01',
            'endDate': '2018-12-31',
        }

        response = get_employee_applied_leave_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for employee_applied_leave in employee_applied_leave_list:
            employee_applied_leave_response = response[index]
            self.assertEqual(employee_applied_leave_response['id'], employee_applied_leave.id)
            index += 1

    def test_create_employee_applied_leave_list(self):

        employee_object = EmployeeFactory()

        data = [{
            'parentEmployee': employee_object.id,
            'dateOfLeave': '2018-01-20',
            'status': PENDING_LEAVE_STATUS,
            'halfDay': True,
            'paidLeave': False,
        }]

        create_employee_applied_leave_list(data)

        EmployeeAppliedLeave.objects.get(parentEmployee_id=data[0]['parentEmployee'],
                                         dateOfLeave=data[0]['dateOfLeave'],
                                         status=data[0]['status'],
                                         halfDay=data[0]['halfDay'],
                                         paidLeave=data[0]['paidLeave'])

    def test_update_employee_applied_leave_list(self):

        employee_applied_leave_object = EmployeeAppliedLeaveFactory()

        data = [{
            'id': employee_applied_leave_object.id,
            'parentEmployee': employee_applied_leave_object.parentEmployee.id,
            'dateOfLeave': employee_applied_leave_object.dateOfLeave,
            'status': APPROVED_LEAVE_STATUS,
            'halfDay': employee_applied_leave_object.halfDay,
            'paidLeave': True,
        }]

        update_employee_applied_leave_list(data)

        EmployeeAppliedLeave.objects.get(parentEmployee_id=data[0]['parentEmployee'],
                                         dateOfLeave=data[0]['dateOfLeave'],
                                         status=data[0]['status'],
                                         halfDay=data[0]['halfDay'],
                                         paidLeave=data[0]['paidLeave'])
