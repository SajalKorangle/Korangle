from django.views.generic import ListView
from .models import Class, Student, Fee, Expense
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from helloworld_project.settings import PROJECT_ROOT
from django.contrib.auth import authenticate, login, logout

from django.db.models import Max

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

import json

import os

"""def login_data_view(request):
	username = 'arnava'
	password = 'harshal03'
	user = authenticate(request, username=username, password=password)
	if user is not None:
		login(request, user)
		if request.user.is_authenticated:
			return JsonResponse({'data':'logged in and authenticated'})
		return JsonResponse({'data':'logged in'})
	else:
		return JsonResponse({'data':'not logged in'})

def logout_view(request):
	logout(request)
	return JsonResponse({'data':'logout'})

def authentication_view(request):
	if request.user is None:
		return JsonResponse({'data':'None'})
	if request.user.is_authenticated:
		print(request.user)
		return JsonResponse({'data':'authenticated'})
	else:
		print(request.user)
		return JsonResponse({'data':'unauthenticated'})"""

@api_view(['GET'])
def class_student_list_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'
	if request.user.is_authenticated:
		#queryset = Class.objects.all().order_by('orderNumber')
		queryset = request.user.class_set.all().order_by('orderNumber')
		classList = []
		for level in queryset:
			tempClass = {}
			tempClass['name'] = level.name
			tempClass['dbId'] = level.id
			tempClass['studentList'] = []
			for student in level.student_set.all().order_by('name'):
				tempStudent = {}
				tempStudent['name'] = student.name
				tempStudent['dbId'] = student.id
				tempClass['studentList'].append(tempStudent)
			classList.append(tempClass)
		return JsonResponse({'data':classList})
	else:
		return JsonResponse({'data':errResponse})

@api_view(['GET'])
def class_list_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'
	#print(request.user)
	if request.user.is_authenticated:
		queryset = request.user.class_set.all().order_by('orderNumber')
		"""queryset = Class.objects.all().order_by('orderNumber')"""
		classList = []
		for level in queryset:
			tempClass = {}
			tempClass['name'] = level.name
			tempClass['dbId'] = level.id
			classList.append(tempClass)
		return JsonResponse({'data':classList})
	else:
		return JsonResponse({'data':errResponse})

def new_student_data_view(request):
	if request.method == "POST":
		student_data = json.loads(request.body.decode('utf-8'))
		class_object = Class.objects.get(id=student_data['classDbId'])
		student_object = Student(name=student_data['name'],fathersName=student_data['fathersName'],parentClass=class_object)
		if student_data['mobileNumber']:
			student_object.mobileNumber = student_data['mobileNumber']
		if student_data['dateOfBirth']:
			student_object.dateOfBirth = student_data['dateOfBirth']
		if student_data['totalFees']:
			student_object.totalFees = student_data['totalFees']
		if student_data['remark']:
			student_object.remark = student_data['remark']
		student_object.save()
		'''student_object = Student.objects.create(name=student_data['name'],
																						fathersName=student_data['fathersName'],
																						mobileNumber=student_data['mobileNumber'],
																						dateOfBirth=student_data['dateOfBirth'],
																						totalFees=student_data['totalFees'],
																						remark=student_data['remark'],
																						parentClass=class_object)'''
		return JsonResponse({'data':'okay'})
	else:
		return JsonResponse({'data':'error'})

def update_student_view(request):
	if request.method == "POST":
		student_data = json.loads(request.body.decode('utf-8'))
		updatedValues = {}
		updatedValues['name'] = student_data['name']
		updatedValues['fathersName'] = student_data['fathersName']
		updatedValues['mobileNumber'] = student_data['mobileNumber']
		updatedValues['dateOfBirth'] = student_data['dateOfBirth']
		updatedValues['totalFees'] = student_data['totalFees']
		updatedValues['remark'] = student_data['remark']
		student_object, created = Student.objects.update_or_create(defaults=updatedValues,id=student_data['dbId'])
		student_data['name'] = student_object.name
		student_data['dbId'] = student_object.id
		student_data['fathersName'] = student_object.fathersName
		student_data['mobileNumber'] = student_object.mobileNumber
		student_data['dateOfBirth'] = student_object.dateOfBirth
		student_data['totalFees'] = student_object.totalFees
		student_data['remark'] = student_object.remark
		student_data['class'] = student_object.parentClass.name
		student_data['feesList'] = []
		student_data['feesDue'] = student_object.totalFees
		for studentFeeEntry in student_object.fee_set.all():
			tempStudentFeeEntry = {}
			tempStudentFeeEntry['receiptNumber'] = studentFeeEntry.receiptNumber
			tempStudentFeeEntry['amount'] = studentFeeEntry.amount
			tempStudentFeeEntry['remark'] = studentFeeEntry.remark
			tempStudentFeeEntry['generationDateTime'] = studentFeeEntry.generationDateTime
			tempStudentFeeEntry['studentDbId'] = studentFeeEntry.parentStudent.id
			student_data['feesDue'] -= studentFeeEntry.amount
			student_data['feesList'].append(tempStudentFeeEntry)
		return JsonResponse({'data':student_data})
	else:
		return JsonResponse({'data':'error'})

@api_view(['POST'])
def delete_student_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'
	if request.user.is_authenticated:
		try:
			student_object = Student.objects.get(pk=request.data['studentDbId'])
		except ObjectDoesNotExist:
			errResponse['message'] = 'This student doesn\'t exist for this user, contact site admin.'
			return JsonResponse({"data": errResponse})
		except MultipleObjectsReturned:
			errResponse['message'] = 'Multiple students of same id, contact site admin.'
			return JsonResponse({"data": errResponse})
		except:
			errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
			return JsonResponse({"data": errResponse})
		Fee.objects.filter(parentStudent=student_object).delete()
		Student.objects.filter(pk=request.data['studentDbId']).delete()
		response['studentDbId'] = request.data['studentDbId']
		response['message'] = 'Student Profile removed successfully.'
		return JsonResponse({'data': response})
	else:
		errResponse['message'] = 'You are not authenticated to delete student profile'
		return JsonResponse({'data': errResponse})



def student_data_view(request):
	student_data = {}
	if request.method == "POST":
		received_json_data = json.loads(request.body.decode('utf-8'))
		student_query = Student.objects.filter(id=received_json_data['dbId'])
		student_data['name'] = student_query[0].name
		student_data['dbId'] = student_query[0].id
		student_data['fathersName'] = student_query[0].fathersName
		student_data['mobileNumber'] = student_query[0].mobileNumber
		student_data['dateOfBirth'] = student_query[0].dateOfBirth
		student_data['totalFees'] = student_query[0].totalFees
		student_data['remark'] = student_query[0].remark
		student_data['class'] = student_query[0].parentClass.name
		student_data['feesList'] = []
		student_data['feesDue'] = student_query[0].totalFees
		receiptNumberMax = Fee.objects.all().aggregate(Max('receiptNumber'))
		student_data['overAllLastFeeReceiptNumber'] = receiptNumberMax['receiptNumber__max']
		for studentFeeEntry in student_query[0].fee_set.all():
			tempStudentFeeEntry = {}
			tempStudentFeeEntry['receiptNumber'] = studentFeeEntry.receiptNumber
			tempStudentFeeEntry['amount'] = studentFeeEntry.amount
			tempStudentFeeEntry['remark'] = studentFeeEntry.remark
			tempStudentFeeEntry['generationDateTime'] = studentFeeEntry.generationDateTime
			tempStudentFeeEntry['studentDbId'] = studentFeeEntry.parentStudent.id
			student_data['feesDue'] -= studentFeeEntry.amount
			student_data['feesList'].append(tempStudentFeeEntry)
		return JsonResponse({'data':student_data})
	else:
		return JsonResponse({'data':'data'})

def new_fee_receipt_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	if request.method == "POST":
		response = {}
		response['status'] = 'success'
		fee_receipt = json.loads(request.body.decode('utf-8'))
		if Fee.objects.filter(receiptNumber=fee_receipt['receiptNumber']):
			errResponse['message'] = 'Failed: Receipt Number already exists'
			return JsonResponse({'data': errResponse})
		student_object = Student.objects.get(id=fee_receipt['studentDbId'])
		fee_receipt_object = Fee.objects.create(receiptNumber=fee_receipt['receiptNumber'],amount=fee_receipt['amount'],remark=fee_receipt['remark'],parentStudent=student_object)
		response['message'] = 'Fee submitted successfully'
		student_data = {}
		student_data['name'] = student_object.name
		student_data['dbId'] = student_object.id
		student_data['fathersName'] = student_object.fathersName
		student_data['mobileNumber'] = student_object.mobileNumber
		student_data['dateOfBirth'] = student_object.dateOfBirth
		student_data['totalFees'] = student_object.totalFees
		student_data['remark'] = student_object.remark
		student_data['class'] = student_object.parentClass.name
		student_data['feesList'] = []
		student_data['feesDue'] = student_object.totalFees
		receiptNumberMax = Fee.objects.all().aggregate(Max('receiptNumber'))
		student_data['overAllLastFeeReceiptNumber'] = receiptNumberMax['receiptNumber__max']
		for studentFeeEntry in student_object.fee_set.all():
			tempStudentFeeEntry = {}
			tempStudentFeeEntry['receiptNumber'] = studentFeeEntry.receiptNumber
			tempStudentFeeEntry['amount'] = studentFeeEntry.amount
			tempStudentFeeEntry['remark'] = studentFeeEntry.remark
			tempStudentFeeEntry['generationDateTime'] = studentFeeEntry.generationDateTime
			tempStudentFeeEntry['studentDbId'] = studentFeeEntry.parentStudent.id
			student_data['feesDue'] -= studentFeeEntry.amount
			student_data['feesList'].append(tempStudentFeeEntry)
		response['studentData'] = student_data
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

@api_view(['POST'])
def fee_list_view(request):
	if request.user.is_authenticated:
		fee_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		#fee_query = Fee.objects.filter(generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])
		fee_query = Fee.objects.filter(parentStudent__parentClass__parentUser=request.user,generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])
		#fee_query = request.user.class_set.student_set.fee_set.objects.filter(generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])
		for fee in fee_query:
			tempFee = {}
			tempFee['receiptNumber'] = fee.receiptNumber
			tempFee['amount'] = fee.amount
			tempFee['generationDateTime'] = fee.generationDateTime
			tempFee['studentName'] = fee.parentStudent.name
			tempFee['fatherName'] = fee.parentStudent.fathersName
			tempFee['className'] = fee.parentStudent.parentClass.name
			tempFee['remark'] = fee.remark
			fee_list.append(tempFee)
		return JsonResponse({'data':fee_list})
	else:
		return JsonResponse({'data':'error'})

@api_view(['POST'])
def new_expense_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	if request.user.is_authenticated:
		response = {}
		response['status'] = 'success'
		expense = json.loads(request.body.decode('utf-8'))
		if Expense.objects.filter(voucherNumber=expense['voucherNumber'],parentUser=request.user):
			errResponse['message'] = 'Failed: Voucher Number already exists'
			return JsonResponse({'data': errResponse})
		expense_object = Expense.objects.create(voucherNumber=expense['voucherNumber'],amount=expense['amount'],remark=expense['remark'],parentUser=request.user)
		response['message'] = 'Expense submitted successfully'
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

@api_view(['POST'])
def expense_list_view(request):
	if request.user.is_authenticated:
		expense_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		expense_query = Expense.objects.filter(generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'],parentUser=request.user)
		for expense in expense_query:
			tempExpense = {}
			tempExpense['voucherNumber'] = expense.voucherNumber
			tempExpense['amount'] = expense.amount
			tempExpense['generationDateTime'] = expense.generationDateTime
			tempExpense['remark'] = expense.remark
			expense_list.append(tempExpense)
		return JsonResponse({'data':expense_list})
	else:
		return JsonResponse({'data':'error'})

