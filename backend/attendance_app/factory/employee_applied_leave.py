
import factory

from employee_app.factory.employee import EmployeeFactory
from attendance_app.models import PENDING_LEAVE_STATUS


class EmployeeAppliedLeaveFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.EmployeeAppliedLeave'
        django_get_or_create = ('parentEmployee', 'status', 'halfDay', 'paidLeave')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    status = PENDING_LEAVE_STATUS
    halfDay = False
    paidLeave = False
