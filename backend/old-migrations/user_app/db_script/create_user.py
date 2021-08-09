

def create_user(apps, schema_editor):

    from django.contrib.auth.models import User
    # User = apps.get_model('auth', 'User')
    Student = apps.get_model('student_app', 'Student')
    Employee = apps.get_model('employee_app', 'Employee')

    counter = 0

    for student_object in Student.objects.all():
        if student_object.mobileNumber is not None:
            if isinstance(student_object.mobileNumber, int):
                if 1000000000 < student_object.mobileNumber <  9999999999:
                    if User.objects.filter(username=student_object.mobileNumber).count() == 0:
                        counter += 1
                        user = User.objects.create_user(username=student_object.mobileNumber,
                                                        password=student_object.mobileNumber,
                                                        first_name=student_object.fathersName)


    for employee_object in Employee.objects.all():
        if employee_object.mobileNumber is not None:
            if isinstance(employee_object.mobileNumber, int):
                if 1000000000 < employee_object.mobileNumber <  9999999999:
                    if User.objects.filter(username=employee_object.mobileNumber).count() == 0:
                        counter += 1
                        user = User.objects.create_user(username=employee_object.mobileNumber,
                                                        password=employee_object.mobileNumber,
                                                        first_name=employee_object.name)

