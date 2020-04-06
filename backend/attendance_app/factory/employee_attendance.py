
import factory

from employee_app.factory.employee import EmployeeFactory

from attendance_app.models import ABSENT_ATTENDANCE_STATUS


class EmployeeAttendanceFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.EmployeeAttendance'
        django_get_or_create = ('parentEmployee', 'status')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    status = ABSENT_ATTENDANCE_STATUS
