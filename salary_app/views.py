from decorators import user_permission

from rest_framework.views import APIView

import json


############## Payslip ##############
from .business.payslip import get_payslip, create_payslip, update_payslip, delete_payslip, get_payslip_list


class PayslipView(APIView):

    @user_permission
    def get(request, payslip_id):
        data = {
            'id': payslip_id,
        }
        if payslip_id is '0':
            data['parentEmployee'] = request.GET['parentEmployee']
            data['month'] = request.GET['month']
            data['year'] = request.GET['year']
        return get_payslip(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_payslip(data)

    @user_permission
    def put(request, payslip_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_payslip(data)

    @user_permission
    def delete(request, payslip_id):
        data = {
            'id': payslip_id,
        }
        return delete_payslip(data)


class PayslipListView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'parentEmployee': employee_id,
        }
        return get_payslip_list(data)


############## Employee Payment ##############
from .business.employee_payment import get_employee_payment_list, create_employee_payment, delete_employee_payment


class EmployeePaymentView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_payment(data)

    @user_permission
    def delete(request, employee_payment_id):
        data = {
            'id': employee_payment_id,
        }
        return delete_employee_payment(data)


class EmployeePaymentListView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'parentEmployee': employee_id,
        }
        return get_employee_payment_list(data)

