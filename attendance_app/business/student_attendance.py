
from attendance_app.models import StudentAttendance

from rest_framework import serializers


class StudentAttendanceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendance
        fields = '__all__'


def get_student_attendance_list(data):

    student_attendance_list = []

    for student_id in data['studentList']:
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
            StudentAttendance.get_or_create(parentStudent=student_attendance_data['parentStudent'],
                                            dateOfAttendance=student_attendance_data['dateOfAttendance'])
        student_attendance_object.status = student_attendance_data['status']
        student_attendance_object.save()

    return 'Student Attendance recorded successfully'


"""def update_student_attendance_list(data):

    for student_attendance_data in data:
        student_attendance_serializer = \
            StudentAttendanceModelSerializer(StudentAttendance.objects.get(id=student_attendance_data['id']),
                                             data=student_attendance_data)
        if student_attendance_serializer.is_valid():
            student_attendance_serializer.save()
        else:
            return 'Student Attendance updation failed'

    return 'Student Attendance updated successfully'"""
