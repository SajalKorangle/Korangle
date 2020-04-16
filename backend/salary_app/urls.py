from django.conf.urls import url

urlpatterns = []

######## Payslip ###############
from .views import PayslipView, EmployeePayslipListView, SchoolPayslipsView, PayslipListView

urlpatterns += [
	url(r'^payslips/batch', PayslipListView.as_view()),
	url(r'^payslips/school/(?P<school_id>[0-9]+)', SchoolPayslipsView.as_view()),
	url(r'^payslips/employee/(?P<employee_id>[0-9]+)', EmployeePayslipListView.as_view()),
	url(r'^payslips/(?P<payslip_id>[0-9]+)', PayslipView.as_view()),
	url(r'^payslips', PayslipView.as_view()),
]

######## Employee Payment ###############
from .views import EmployeePaymentView, EmployeePaymentListView, SchoolEmployeePaymentsView

urlpatterns += [
	url(r'^employee-payments/school/(?P<school_id>[0-9]+)', SchoolEmployeePaymentsView.as_view()),
	url(r'^employee-payments/employee/(?P<employee_id>[0-9]+)', EmployeePaymentListView.as_view()),
	url(r'^employee-payments/(?P<employee_payment_id>[0-9]+)', EmployeePaymentView.as_view()),
	url(r'^employee-payments', EmployeePaymentView.as_view()),
]

from .views import PaySlipView, PaySlipListView

urlpatterns += [
	url(r'^payslip/batch',PaySlipListView.as_view()),
	url(r'^payslip',PaySlipView.as_view())
]

from .views import EmployeeePaymentView, EmployeeePaymentListView

urlpatterns += [
	url(r'^employee-payment/batch',EmployeeePaymentListView.as_view()),
	url(r'^employee-payment',EmployeeePaymentView.as_view())
]