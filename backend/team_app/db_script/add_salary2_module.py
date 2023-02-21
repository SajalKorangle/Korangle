def add_salary2_module(apps, schema_editor):
  FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')
  Module = apps.get_model('team_app', 'Module')
  Task = apps.get_model('team_app', 'Task')
  EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
  # extract feature Flag
  feature_flag_object = FeatureFlag.objects.filter(name = 'Salary 2').first()
  # add entry into Module
  module_object = Module(path = 'salary2', title = 'Salary 2.0', icon = 'account_circle', parentBoard = None, parentFeatureFlag = feature_flag_object, orderNumber = 5)
  module_object.save()
  # add entry into Task for Salary 2.0
  # Design Payslip
  design_payslip = Task(parentModule = module_object, path = 'design_payslip', title = 'Design Payslip', parentBoard = None, videoUrl = '', parentFeatureFlag = feature_flag_object, orderNumber = 1)
  design_payslip.save()
  # add entry for employee permission for all tasks in Salary 2.0
  for employee_permission in EmployeePermission.objects.filter(parentTask__path = 'assign_task'):
        employee = EmployeePermission()
        employee.parentTask = design_payslip
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()