
from team_app.db_script.populate_app import set_task_order, populate_task_in_all_schools_and_users


def add_approve_leave_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='attendance')

    task_object_one = Task(path='approve_leave', title='Approve Leave', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    set_task_order('attendance', 'record_student_attendance', 1, apps)
    set_task_order('attendance', 'record_employee_attendance', 2, apps)
    set_task_order('attendance', 'declare_holidays', 3, apps)
    set_task_order('attendance', 'approve_leave', 4, apps)
    set_task_order('attendance', 'give_permissions', 5, apps)
