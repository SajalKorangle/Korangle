from decorators import user_permission
from common.common_views_3 import CommonView, CommonListView

from rest_framework.views import APIView

import json


############## Payslip ##############
from .business.payslip import get_payslip, create_payslip, update_payslip, delete_payslip, \
    get_employee_payslip_list, get_school_payslip_list, get_payslip_list


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


class EmployeePayslipListView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'parentEmployee': employee_id,
        }
        return get_employee_payslip_list(data)


class PayslipListView(APIView):

    @user_permission
    def get(request):
        return get_payslip_list(request.GET)


class SchoolPayslipsView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_school_payslip_list(data)


############## Employee Payment ##############
from .business.employee_payment import get_employee_payment_list, create_employee_payment, delete_employee_payment, \
    get_school_employee_payment_list


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


class SchoolEmployeePaymentsView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_school_employee_payment_list(data)

from .models import Payslip

class PaySlipView(CommonView,APIView):
    Model = Payslip
    RelationsToSchool = ['parentEmployee__parentSchool']

class PaySlipListView(CommonListView,APIView):
    Model = Payslip
    RelationsToSchool = ['parentEmployee__parentSchool']

from .models import EmployeePayment

class EmployeeePaymentView(CommonView,APIView):
    Model = EmployeePayment
    RelationsToSchool = ['parentEmployee__parentSchool']

class EmployeeePaymentListView(CommonListView,APIView):
    Model = EmployeePayment
    RelationsToSchool = ['parentEmployee__parentSchool']