from django.db.models import F
from django.db.models import Q
from datetime import date
from student_app.models import StudentSection, Student
from employee_app.models import Employee

def employeeHasSchoolPermission(user, schooldID):    
    employee_queryset = Employee.objects.filter(mobileNumber=user.username,
                                                    parentSchool=schooldID,
                                                    parentSchool__dateOfExpiration__gte=date.today(),
                                                    dateOfLeaving=None)
    if (len(employee_queryset) > 0):
        return True
    return False

def parentHasStudentPermission(user, studentID):
    student = Student.objects.get(id=studentID)
    return (user.username == student.mobileNumber
                or user.username == student.secondMobileNumber)

