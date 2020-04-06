
from team_app.db_script.populate_app import set_task_order, populate_task_in_all_schools_and_users


def add_record_employee_attendance_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='attendance')

    task_object_one = Task(path='record_employee_attendance', title='Record Empl. Attend.', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    # populate_task_in_all_schools_and_users(module_object, task_object_one, apps)

    set_task_order('attendance', 'record_attendance', 1, apps)
    set_task_order('attendance', 'record_employee_attendance', 2, apps)
    set_task_order('attendance', 'declare_holidays', 3, apps)
    set_task_order('attendance', 'give_permissions', 4, apps)

    change_record_student_attendance_task(apps, schema_editor)


def change_record_student_attendance_task(apps, schema_editor):

    Task = apps.get_model('team_app', 'Task')

    task_object = Task.objects.get(path='record_attendance')
    task_object.path = 'record_student_attendance'
    task_object.title = 'Record Stud. Attend.'

    task_object.save()
