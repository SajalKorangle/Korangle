
from django.core.exceptions import ObjectDoesNotExist

from attendance_app.models import StudentAttendance

from rest_framework import serializers


class StudentAttendanceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendance
        fields = '__all__'


def get_student_attendance_list(data):

    student_attendance_list = []

    for student_id in data['studentIdList'].split(','):
        for student_attendance_object in \
                StudentAttendance.objects.filter(parentStudent_id=student_id,
                                                 dateOfAttendance__gte=data['startDate'],
                                                 dateOfAttendance__lte=data['endDate']) \
                        .order_by('dateOfAttendance'):
            student_attendance_list.append(StudentAttendanceModelSerializer(student_attendance_object).data)

    return student_attendance_list


def create_or_update_student_attendance_list(data):

    for student_attendance_data in data:

        student_attendance_object, created = \
            StudentAttendance.objects.get_or_create(parentStudent_id=student_attendance_data['parentStudent'],
                                                    dateOfAttendance=student_attendance_data['dateOfAttendance'])
        student_attendance_object.status = student_attendance_data['status']
        student_attendance_object.save()

    return 'Student Attendance recorded successfully'


def delete_student_attendance_list(data):

    for student_id in data['studentIdList'].split(','):
        StudentAttendance.objects.filter(parentStudent_id=student_id,
                                         dateOfAttendance__gte=data['startDate'],
                                         dateOfAttendance__lte=data['endDate']).delete()

    return 'Student Attendance Record deleted Successfully'

