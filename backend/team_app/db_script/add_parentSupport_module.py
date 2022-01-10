def add_parentSupport_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module(path = 'parent_support', title = 'Parent Support', icon = 'question_answer', orderNumber = 5, parentBoard = None)
    module_object.save()

    manage_complaint_types = Task(path = 'manage_complaint_types', parentModule = module_object, title = 'Manage Complaint Types', orderNumber = 1, parentBoard = None)
    manage_complaint_types.save()

    manage_all_complaints = Task(path = 'manage_all_complaints', parentModule = module_object, title = 'Manage All Complaints', orderNumber = 2, parentBoard = None)
    manage_all_complaints.save()

    count_all = Task(path = 'count_all', parentModule = module_object, title = 'Count All', orderNumber = 3, parentBoard = None)
    count_all.save()

    add_complaint = Task(path = 'add_complaint', parentModule = module_object, title = 'Add Complaint', orderNumber = 4, parentBoard = None)
    add_complaint.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path = 'assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_complaint_types
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = manage_all_complaints
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
