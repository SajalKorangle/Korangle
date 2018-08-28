from attendance_app.business.student_attendance import get_student_attendance_list, \
    create_or_update_student_attendance_list, delete_student_attendance_list
from attendance_app.factory.student_attendance import StudentAttendanceFactory
from parent_test import ParentTestCase

from attendance_app.models import StudentAttendance

from student_app.factories.student import StudentFactory


class StudentAttendanceTestCase(ParentTestCase):

    def test_get_student_attendance_list(self):

        student_list = []
        student_list.extend(StudentFactory.create_batch(3))

        for student in student_list:
            StudentAttendanceFactory(parentStudent_id=student.id)

        student_id_list = str(student_list[0].id) + ',' + str(student_list[1].id) + ',' + str(student_list[2].id)

        data = {
            'studentIdList': student_id_list,
            'startDate': '2011-01-01',
            'endDate': '2011-01-01',
        }

        response = get_student_attendance_list(data)

        self.assertEqual(response.__len__(), 3)

        index = 0
        for response_data in response:
            response_data['parentStudent'] = student_list[index].id
            response_data['dateOfAttenance'] = '2011-01-01'
            response_data['status'] = StudentAttendance.ABSENT_ATTENDANCE_STATUS

    def test_create_or_update_student_attendance_list(self):

        student_object_one = StudentFactory()
        student_object_two = StudentFactory()

        data_list = [
            {
                'parentStudent': student_object_one.id,
                'dateOfAttendance': '2016-01-01',
                'status': StudentAttendance.PRESENT_ATTENDANCE_STATUS
            },
            {
                'parentStudent': student_object_two.id,
                'dateOfAttendance': '2016-01-01',
                 'status': StudentAttendance.PRESENT_ATTENDANCE_STATUS
            }
        ]

        create_or_update_student_attendance_list(data_list)

        object_one = StudentAttendance.objects.get(parentStudent_id=data_list[0]['parentStudent'],
                                                   dateOfAttendance=data_list[0]['dateOfAttendance'])
        self.assertEqual(object_one.status, data_list[0]['status'])

        object_two = StudentAttendance.objects.get(parentStudent_id=data_list[1]['parentStudent'],
                                                   dateOfAttendance=data_list[1]['dateOfAttendance'])
        self.assertEqual(object_two.status, data_list[1]['status'])

    def test_delete_student_attendance_list(self):

        student_list = []
        student_list.extend(StudentFactory.create_batch(3))

        for student in student_list:
            StudentAttendanceFactory(parentStudent_id=student.id)

        student_id_list = str(student_list[0].id) + ',' + str(student_list[1].id) + ',' + str(student_list[2].id)

        data = {
            'studentIdList': student_id_list,
            'startDate': '2011-01-01',
            'endDate': '2011-01-01',
        }

        delete_student_attendance_list(data)

        for student_id in student_id_list.split(','):
            self.assertEqual(StudentAttendance.objects.filter(parentStudent_id=int(student_id),
                                                              dateOfAttendance__gte=data['startDate'],
                                                              dateOfAttendance__lte=data['endDate']).count(), 0)
