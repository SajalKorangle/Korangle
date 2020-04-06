
def add_generate_final_report_task(apps,schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    custom_reportcard = Module.objects.get(path='custom_reportcard')
    
    manageLayoutTask = Task()
    manageLayoutTask.parentModule = custom_reportcard
    manageLayoutTask.path = 'generate_final_report'
    manageLayoutTask.title = 'Generate Final Report'
    manageLayoutTask.orderNumber = 3
    manageLayoutTask.parentBoard = None
    manageLayoutTask.save()


    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manageLayoutTask
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
