
from employee_app.models import Employee


def get_employee_mini_profile_list(data):

    employee_list = []

    for employee_object in Employee.objects.filter(parentSchool_id=data['parentSchool']).order_by('name'):
        tempEmployee = {
            'id': employee_object.id,
            'name': employee_object.name,
            'employeeNumber': employee_object.employeeNumber,
            'mobileNumber': employee_object.mobileNumber,
            'dateOfLeaving': employee_object.dateOfLeaving,
            'isNonSalariedEmployee': employee_object.isNonSalariedEmployee,
        }
        if employee_object.profileImage:
            tempEmployee['profileImage'] = employee_object.profileImage.url
        else:
            tempEmployee['profileImage'] = None
        employee_list.append(tempEmployee)

    return employee_list
