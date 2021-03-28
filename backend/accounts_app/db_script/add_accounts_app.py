
from team_app.db_script.populate_app import populate_task_in_all_schools

def add_accounts_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='accounts',
                           title='Accounts',
                           orderNumber=7,
                           icon='account_balance')
    module_object.save()

    data = [
        {
            'path' : 'add_transaction',
            'title' : 'Add Transaction',
            'orderNumber' : 1,
        },
        {
            'path' : 'update_transaction',
            'title' : 'Update Transaction',
            'orderNumber' : 2,
        },
        {
            'path' : 'view_transactions',
            'title' : 'View Transactions',
            'orderNumber' : 3,
        },
        {
            'path' : 'view_balance',
            'title' : 'View Balance',
            'orderNumber' : 4,
        },
        {
            'path' : 'request_approval',
            'title' : 'Request Approval',
            'orderNumber' : 5,
        },
        {
            'path' : 'grant_approval',
            'title' : 'Grant Approval',
            'orderNumber' : 6,
        },
        {
            'path' : 'manage_accounts',
            'title' : 'Manage Accounts',
            'orderNumber' : 7,
        },
        {
            'path' : 'transfer_balance',
            'title' : 'Transfer Balance',
            'orderNumber' : 8,
        },
        {
            'path' : 'settings',
            'title' : 'Settings',
            'orderNumber' : 9,
        },
    ]

    task_list = []

    for task_data in data:
        task_object = Task(path=task_data['path'], title=task_data['title'],
                           orderNumber=task_data['orderNumber'], parentModule=module_object)
        task_object.save()
        task_list.append(task_object)

    populate_task_in_all_schools(apps, task_list)
