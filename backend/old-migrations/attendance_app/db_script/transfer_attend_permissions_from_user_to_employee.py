

def transfer_attend_permissions_from_user_to_employee(apps, schema_editor):

    AttendancePermission = apps.get_model('attendance_app', 'AttendancePermission')
    Employee = apps.get_model('employee_app', 'Employee')

    for attendance_permission in AttendancePermission.objects.all():

        employee = Employee.objects.get(parentSchool=attendance_permission.parentSchool,
                                        mobileNumber=attendance_permission.parentUser.username)
        attendance_permission.parentEmployee = employee
        attendance_permission.save()
