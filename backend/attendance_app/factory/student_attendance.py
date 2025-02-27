
import factory

from student_app.factories.student import StudentFactory

from attendance_app.models import ABSENT_ATTENDANCE_STATUS


class StudentAttendanceFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.StudentAttendance'
        django_get_or_create = ('parentStudent', 'status')

    parentStudent = factory.SubFactory(StudentFactory)
    status = ABSENT_ATTENDANCE_STATUS
