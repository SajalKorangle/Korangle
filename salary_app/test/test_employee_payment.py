
from parent_test import ParentTestCase

# Factory
from salary_app.factory.employee_payment import EmployeePaymentFactory
from employee_app.factory.employee import EmployeeFactory

# Business
from salary_app.business.employee_payment \
    import get_employee_payment_list, create_employee_payment, delete_employee_payment

# Model
from salary_app.models import EmployeePayment


class EmployeePaymentTestCase(ParentTestCase):

    def test_get_employee_payment_list(self):

        employee_object = EmployeeFactory()

        employee_payment_list = []

        employee_payment_list.append(EmployeePaymentFactory(parentEmployee=employee_object, amount=1000))
        employee_payment_list.append(EmployeePaymentFactory(parentEmployee=employee_object, amount=2000))

        data = {
            'parentEmployee': employee_object.id,
        }

        response = get_employee_payment_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for employee_payment in employee_payment_list:
            employee_payment_response = response[index]
            self.assertEqual(employee_payment_response['id'], employee_payment.id)
            index += 1

    def test_create_employee_payment(self):

        employee_object = EmployeeFactory()

        data = {
            'parentEmployee': employee_object.id,
            'amount': 9000,
            'remark': 'testing',
        }

        create_employee_payment(data)

        EmployeePayment.objects.get(parentEmployee_id=data['parentEmployee'],
                                    amount=data['amount'],
                                    remark=data['remark'])

    def test_delete_employee_payment(self):

        employee_payment_object = EmployeePaymentFactory()

        data = {
            'id': employee_payment_object.id
        }

        delete_employee_payment(data)

        self.assertEqual(EmployeePayment.objects.filter(id=data['id']).count(),0)