from django.conf.urls import url

urlpatterns = []

######## Payslip ###############
from .views import PayslipView, PayslipListView, SchoolPayslipsView

urlpatterns += [
	url(r'^payslips/school/(?P<school_id>[0-9]+)', SchoolPayslipsView.as_view()),
	url(r'^payslips/employee/(?P<employee_id>[0-9]+)', PayslipListView.as_view()),
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
