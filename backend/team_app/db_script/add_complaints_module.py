def add_complaints_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module(path = 'complaints', title = 'Complaints', icon = 'question_answer', orderNumber = 5, parentBoard = None)
    module_object.save()

    manage_complaint_type = Task(path = 'manage_complaint_type', parentModule = module_object, title = 'Manage Complaint Type', orderNumber = 1, parentBoard = None)
    manage_complaint_type.save()

    manage_complaints = Task(path = 'manage_complaints', parentModule = module_object, title = 'Manage Complaints', orderNumber = 2, parentBoard = None)
    manage_complaints.save()

    count_all = Task(path = 'count_all', parentModule = module_object, title = 'Count All', orderNumber = 3, parentBoard = None)
    count_all.save()

    add_complaint = Task(path = 'add_complaint', parentModule = module_object, title = 'Add Complaint', orderNumber = 4, parentBoard = None)
    add_complaint.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path = 'assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_complaint_type
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = manage_complaints
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = count_all
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = add_complaint
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
