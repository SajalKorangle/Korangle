
from team_app.db_script.populate_app import populate_in_all_schools, set_module_order


def access_fees_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='fees')
    module_object.path = 'fees-old'
    module_object.save()

    module_object = Module(path='fees',
                           title='Fees 3.0',
                           orderNumber=2,
                           icon='receipt')
    module_object.save()

    task_data_list = [
        {'path': 'collect_fee', 'title': 'Collect Fee'},
        {'path': 'my_collection', 'title': 'My Collection'},
        {'path': 'total_collection', 'title': 'Total Collection'},
        {'path': 'view_defaulters', 'title': 'View Defaulters'},
        {'path': 'generate_fees_certificate', 'title': 'Generate Fees Certificate'},
        {'path': 'generate_fees_report', 'title': 'Generate Fees Report'},
        {'path': 'give_discount', 'title': 'Give Discount'},
        {'path': 'total_discount', 'title': 'Total Discount'},
        {'path': 'cancel_fee_receipt', 'title': 'Cancel Fee Receipt'},
        {'path': 'cancel_discount', 'title': 'Cancel Discount'},
        {'path': 'update_student_fees', 'title': 'Update Student Fees'},
        {'path': 'set_school_fees', 'title': 'Set School Fees'},
        {'path': 'add_fee_type', 'title': 'Add Fee Type'},
        {'path': 'lock_fees', 'title': 'Lock Fees'},
    ]

    task_list = []
    for data in task_data_list:
        task_object = Task(path=data['path'], title=data['title'], orderNumber=len(task_list)+1,
                           parentModule=module_object)
        task_object.save()
        task_list.append(task_object)

    populate_in_all_schools(module_object, apps, task_list)

