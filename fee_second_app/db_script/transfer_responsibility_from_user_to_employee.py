

def transfer_responsibility_from_user_to_employee(apps, schema_editor):

    FeeReceipt = apps.get_model('fee_second_app', 'FeeReceipt')
    ConcessionSecond = apps.get_model('fee_second_app', 'ConcessionSecond')
    Employee = apps.get_model('employee_app', 'Employee')

    for fee_receipt in FeeReceipt.objects.all():

        if fee_receipt.parentReceiver:

            school = fee_receipt.parentStudent.parentSchool
            user = fee_receipt.parentReceiver
            employee = Employee.objects.get(parentSchool=school, mobileNumber=user.username)
            fee_receipt.parentEmployee = employee
            fee_receipt.save()

    for concession_second in ConcessionSecond.objects.all():

        if concession_second.parentReceiver:
            school = concession_second.parentStudent.parentSchool
            user = concession_second.parentReceiver
            employee = Employee.objects.get(parentSchool=school, mobileNumber=user.username)
            concession_second.parentEmployee = employee
            concession_second.save()

