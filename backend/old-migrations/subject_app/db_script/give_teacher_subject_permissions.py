

def give_teacher_subject_permission(apps, schema_editor):

    ClassSubject = apps.get_model('subject_app', 'ClassSubject')
    Employee = apps.get_model('employee_app', 'Employee')

    for class_subject in ClassSubject.objects.all():
        employee_object = get_employee_admin(apps, class_subject)
        if employee_object is not None:
            class_subject.parentEmployee = employee_object
        else:
            class_subject.parentEmployee = Employee.objects.filter(parentSchool=class_subject.parentSchool)[0]
        class_subject.save()


def get_employee_admin(apps, class_subject):

    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    employee_permission_queryset = EmployeePermission.objects.filter(parentEmployee__parentSchool=class_subject.parentSchool,
                                                                     parentTask__path='assign_task')

    if employee_permission_queryset.count() > 0:
        return employee_permission_queryset[0].parentEmployee
    else:
        return None