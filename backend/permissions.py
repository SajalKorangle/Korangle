from django.db.models import F
from django.db.models import Q
from datetime import date
from student_app.models import StudentSection, Student
from employee_app.models import Employee

def employeeHasSchoolPermission(user, schoolID):    
    employee_queryset = Employee.objects.filter(mobileNumber=user.username,
                                                    parentSchool=schoolID,
                                                    parentSchool__expired=False,
                                                    dateOfLeaving=None)
    return len(employee_queryset) > 0

def parentHasStudentPermission(user, studentID):
    student = Student.objects.get(id=studentID)
    return (user.username == str(student.mobileNumber)
                or user.username == str(student.secondMobileNumber))

