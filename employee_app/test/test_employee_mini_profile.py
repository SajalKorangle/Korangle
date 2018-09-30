
from parent_test import ParentTestCase

# Factory
from school_app.factory.school import SchoolFactory
from employee_app.factory.employee import EmployeeFactory

# Business
from employee_app.business.employee_mini_profile import get_employee_mini_profile_list


class EmployeeMiniProfileTestCase(ParentTestCase):

    def test_get_employee_mini_profile_list(self):

        school_object = SchoolFactory()

        employee_list = []

        employee_list.extend(EmployeeFactory.create_batch(3, parentSchool=school_object))

        data = {
            'parentSchool': school_object.id,
        }

        response = get_employee_mini_profile_list(data)

        self.assertEqual(len(response), 4)

        index = 0
        for employee in employee_list:
            employee_response = response[index]
            self.assertEqual(employee.parentSchool.id, school_object.id)
            self.assertEqual(employee_response['id'], employee.id)
            self.assertEqual(employee_response['name'], employee.name)
            self.assertEqual(employee_response['employeeNumber'], employee.employeeNumber)
            self.assertEqual(employee_response['mobileNumber'], employee.mobileNumber)
            index += 1
