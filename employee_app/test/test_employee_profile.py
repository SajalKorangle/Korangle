
from parent_test import ParentTestCase

# Factory
from school_app.factory.school import SchoolFactory
from employee_app.factory.employee import EmployeeFactory

# Business
from employee_app.business.employee_profile \
    import create_employee_profile, get_employee_profile, delete_employee_profile, \
    update_employee_profile, EmployeeModelSerializer, get_employee_profile_list

# Model
from employee_app.models import Employee


class EmployeeProfileTestCase(ParentTestCase):

    def test_get_employee_profile_list(self):

        school_object = SchoolFactory()

        employee_list = []

        employee_list.extend(EmployeeFactory.create_batch(3, parentSchool=school_object))

        data = {
            'parentSchool': school_object.id,
        }

        response = get_employee_profile_list(data)

        self.assertEqual(len(response), 3)

        for employee in employee_list:
            self.assertEqual(employee.parentSchool.id, school_object.id)
            result = False
            for employee_response in response:
                if employee_response['id'] == employee.id:
                    result = True
            self.assertEqual(result, True)

    def test_create_employee_profile(self):

        school_object = SchoolFactory()

        data = {
            'name': 'Dummy',
            'fatherName': 'Dummy Father',
            'parentSchool': school_object.id,
            'mobileNumber': 7999951154,
        }

        create_employee_profile(data)

        Employee.objects.get(name=data['name'],
                             fatherName=data['fatherName'],
                             parentSchool_id=data['parentSchool'])

    def test_update_employee_profile(self):

        employee_object = EmployeeFactory()

        employee_serializer = EmployeeModelSerializer(employee_object)

        data = employee_serializer.data

        data['name'] = 'okay now'

        update_employee_profile(data)

        self.assertEqual(Employee.objects.get(id=employee_serializer.data['id']).name, 'okay now')

    def test_get_employee_profile(self):

        employee_object = EmployeeFactory()

        data = {
            'id': employee_object.id,
        }

        response = get_employee_profile(data)

        self.assertEqual(response['name'], employee_object.name)
        self.assertEqual(response['id'], data['id'])

    def test_delete_employee_profile(self):

        employee_object = EmployeeFactory()

        data = {
            'id': employee_object.id
        }

        delete_employee_profile(data)

        self.assertEqual(Employee.objects.filter(id=data['id']).count(),0)