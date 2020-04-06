
from team_app.db_script.populate_app import populate_in_all_schools, set_module_order


def create_salary_app_access(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='salary',
                           title='Salary',
                           icon='account_circle')
    module_object.save()

    task_object_one = Task(path='generate_payslip', title='Generate Payslip', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='record_payment', title='Record Payment', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)

    populate_in_all_schools(module_object, apps, task_list)

    set_module_order('sms', 4, apps)
    set_module_order('attendance', 5, apps)
    set_module_order('employees', 6, apps)
    set_module_order('marksheet', 7, apps)
    set_module_order('salary', 8, apps)
    set_module_order('expenses', 9, apps)
    set_module_order('enquiries', 10, apps)
    set_module_order('vehicle', 11, apps)
    set_module_order('school', 12, apps)
    set_module_order('team', 13, apps)
