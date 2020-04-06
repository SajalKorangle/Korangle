
from parent_test import ParentTestCase

# Factory
from employee_app.factory.employee_permisson import EmployeePermissionFactory, EmployeeFactory, ModuleFactory

# Business
from employee_app.business.employee_permission \
    import get_employee_permission_list, create_employee_permission, delete_employee_permission

# Model
from employee_app.models import EmployeePermission


class EmployeePermissionTestCase(ParentTestCase):

    def test_get_employee_permission_list(self):

        employee_object = EmployeeFactory()
        module_object = ModuleFactory()

        employee_permission_list = []

        employee_permission_list.append(EmployeePermissionFactory(parentEmployee=employee_object,parentTask=module_object.task_set.all()[0]))
        employee_permission_list.append(EmployeePermissionFactory(parentEmployee=employee_object,parentTask=module_object.task_set.all()[1]))

        data = {
            'parentEmployee': employee_object.id
        }

        response = get_employee_permission_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for employee_permission in employee_permission_list:
            employee_permission_response = response[index]
            self.assertEqual(employee_permission_response['id'], employee_permission.id)
            index += 1

    def test_create_employee_permission(self):

        employee_object = EmployeeFactory()
        module_object = ModuleFactory()

        data = {
            'parentEmployee': employee_object.id,
            'parentTask': module_object.task_set.all()[0].id,
        }

        create_employee_permission(data)

        EmployeePermission.objects.get(parentEmployee_id=data['parentEmployee'],
                                       parentTask_id=data['parentTask'])

    def test_delete_employee_permission(self):

        employee_permission_object = EmployeePermissionFactory()

        data = {
            'id': employee_permission_object.id
        }

        delete_employee_permission(data)

        self.assertEqual(EmployeePermission.objects.filter(id=data['id']).count(),0)
