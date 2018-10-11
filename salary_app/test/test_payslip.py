
from parent_test import ParentTestCase

# Factory
from salary_app.factory.payslip import PayslipFactory
from employee_app.factory.employee import EmployeeFactory

# Business
from salary_app.business.payslip \
    import get_payslip, get_payslip_list, create_payslip, delete_payslip, update_payslip

# Model
from salary_app.models import Payslip


class PayslipTestCase(ParentTestCase):

    def test_get_payslip(self):

        payslip_object = PayslipFactory(month='OCTOBER', year=2018)

        data = {
            'id': payslip_object.id,
        }

        response = get_payslip(data)

        self.assertEqual(response['id'], payslip_object.id)
        self.assertEqual(response['parentEmployee'], payslip_object.parentEmployee.id)
        self.assertEqual(response['amount'], payslip_object.amount)
        self.assertEqual(response['month'], payslip_object.month)
        self.assertEqual(response['year'], payslip_object.year)
        self.assertEqual(response['dateOfGeneration'], payslip_object.dateOfGeneration.strftime('%Y-%m-%d'))
        self.assertEqual(response['remark'], payslip_object.remark)

    def test_get_employee_payment_list(self):

        employee_object = EmployeeFactory()

        payslip_list = []

        payslip_list.append(PayslipFactory(parentEmployee=employee_object, amount=1000, month='OCTOBER', year=2018))
        payslip_list.append(PayslipFactory(parentEmployee=employee_object, amount=2000, month='NOVEMBER', year=2018))

        data = {
            'parentEmployee': employee_object.id,
        }

        response = get_payslip_list(data)

        self.assertEqual(len(response), 2)

        index = 0
        for payslip in payslip_list:
            payslip_response = response[index]
            self.assertEqual(payslip_response['id'], payslip.id)
            index += 1

    def test_create_employee_payment(self):

        employee_object = EmployeeFactory()

        data = {
            'parentEmployee': employee_object.id,
            'amount': 9000,
            'month': 'OCTOBER',
            'year': 2018,
            'remark': 'testing',
        }

        create_payslip(data)

        PayslipFactory.objects.get(parentEmployee_id=data['parentEmployee'],
                                   month=data['month'],
                                   year=data['year'],
                                   amount=data['amount'],
                                   remark=data['remark'])

    def test_create_employee_payment(self):

        payslip_object = PayslipFactory()

        data = {
            'id': payslip_object.id,
            'parentEmployee': payslip_object.parentEmployee.id,
            'amount': 9000,
            'month': 'OCTOBER',
            'year': 2018,
            'remark': 'testing',
        }

        update_payslip(data)

        Payslip.objects.get(id=data['id'],
                            parentEmployee_id=data['parentEmployee'],
                            month=data['month'],
                            year=data['year'],
                            amount=data['amount'],
                            remark=data['remark'])

    def test_delete_employee_payment(self):

        payslip_object = PayslipFactory()

        data = {
            'id': payslip_object.id
        }

        delete_payslip(data)

        self.assertEqual(Payslip.objects.filter(id=data['id']).count(),0)
