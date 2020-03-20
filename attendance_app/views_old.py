from django.shortcuts import render

from decorators import user_permission

from rest_framework.views import APIView

import json


############## Student Attendance ##############
from .business_old.student_attendance \
    import create_or_update_student_attendance_list, get_student_attendance_list, delete_student_attendance_list


class StudentAttendanceListView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_or_update_student_attendance_list(data)

    @user_permission
    def get(request):
        data = {
            'studentIdList': request.GET['studentIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return get_student_attendance_list(data)

    @user_permission
    def delete(request):
        data = {
            'studentIdList': request.GET['studentIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return delete_student_attendance_list(data)

    '''@user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_or_update_student_attendance_list(data)'''


############## Employee Attendance ##############
from .business_old.employee_attendance \
    import create_or_update_employee_attendance_list, get_employee_attendance_list, delete_employee_attendance_list


class EmployeeAttendanceListView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_or_update_employee_attendance_list(data)

    @user_permission
    def get(request):
        data = {
            'employeeIdList': request.GET['employeeIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return get_employee_attendance_list(data)

    @user_permission
    def delete(request):
        data = {
            'employeeIdList': request.GET['employeeIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return delete_employee_attendance_list(data)

    '''@user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_or_update_employee_attendance_list(data)'''


############## Employee Applied Leave ##############
from .business_old.employee_applied_leave \
    import get_employee_applied_leave_list, create_employee_applied_leave_list, update_employee_applied_leave_list


class EmployeeAppliedLeaveListView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_applied_leave_list(data)

    @user_permission
    def get(request):
        data = {
            'employeeIdList': request.GET['employeeIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return get_employee_applied_leave_list(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_employee_applied_leave_list(data)

    '''@user_permission
    def delete(request):
        data = {
            'employeeIdList': request.GET['employeeIdList'],
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return delete_employee_attendance_list(data)'''


############## Attendance Permission ##############
from .business_old.attendance_permission \
    import get_attendance_permission_list, create_attendance_permission, delete_attendance_permission


class AttendancePermissionOldView(APIView):

    @user_permission
    def get(request):
        data = {
            'parentEmployee': request.GET['parentEmployee'],
            'sessionId': request.GET['sessionId'],
        }
        return get_attendance_permission_list(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_attendance_permission(data)

    @user_permission
    def delete(request, attendance_permission_id):
        data = {
            'id': attendance_permission_id
        }
        return delete_attendance_permission(data)
