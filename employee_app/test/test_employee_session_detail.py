
from parent_test import ParentTestCase

# Factory
from employee_app.factory.employee_session_detail import EmployeeSessionDetailFactory
from employee_app.factory.employee import EmployeeFactory
from school_app.factory.school import SchoolFactory
from school_app.factory.factory_models import SessionFactory

# Business
from employee_app.business.employee_session_detail \
    import get_employee_session_detail_list, create_employee_session_detail, update_employee_session_detail, \
    get_employee_session_detail

# Model
from employee_app.models import EmployeeSessionDetail
from school_app.model.models import Session
from class_app.models import Section
from django.contrib.auth.models import User


class EmployeeSessionDetailTestCase(ParentTestCase):

    def test_get_employee_session_detail_list(self):

        school_object = SchoolFactory()

        employee_object_one = EmployeeFactory(parentSchool=school_object)
        employee_object_two = EmployeeFactory(parentSchool=school_object)

        employee_session_detail_list = []

        employee_session_detail_list.append(EmployeeSessionDetailFactory(parentEmployee=employee_object_one))
        employee_session_detail_list.append(EmployeeSessionDetailFactory(parentEmployee=employee_object_two))

        data = {
            'parentSchool': school_object.id,
            'sessionId': Session.objects.all()[0].id,
        }

        response = get_employee_session_detail_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for employee_session_detail in employee_session_detail_list:
            employee_session_detail_response = response[index]
            self.assertEqual(employee_session_detail_response['id'], employee_session_detail.id)
            index += 1

    def test_create_employee_session_detail(self):

        employee_object = EmployeeFactory()

        data = {
            'parentEmployee': employee_object.id,
            'parentSession': Session.objects.all()[0].id,
            'paidLeaveNumber': 12,
        }

        create_employee_session_detail(data)

        EmployeeSessionDetail.objects.get(parentEmployee_id=data['parentEmployee'],
                                          parentSession=data['parentSession'],
                                          paidLeaveNumber=data['paidLeaveNumber'])

    def test_update_employee_session_detail(self):

        employee_session_detail_object = EmployeeSessionDetailFactory()

        data = {
            'id': employee_session_detail_object.id,
            'parentEmployee': employee_session_detail_object.parentEmployee.id,
            'parentSession': employee_session_detail_object.parentSession.id,
            'paidLeaveNumber': 13,
        }

        update_employee_session_detail(data)

        EmployeeSessionDetail.objects.get(parentEmployee_id=data['parentEmployee'],
                                          parentSession=data['parentSession'],
                                          paidLeaveNumber=data['paidLeaveNumber'])

    def test_get_employee_session_detail(self):

        employee_object = EmployeeSessionDetailFactory()
        data = {
            'parentEmployee': employee_object.parentEmployee.id,
            'sessionId': employee_object.parentSession.id,
        }

        response = get_employee_session_detail(data)

        self.assertEqual(response['id'], employee_object.id)
        self.assertEqual(response['parentEmployee'], employee_object.parentEmployee.id)
        self.assertEqual(response['parentSession'], employee_object.parentSession.id)
        self.assertEqual(response['paidLeaveNumber'], employee_object.paidLeaveNumber)
