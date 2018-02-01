from django.views.generic import ListView
from .models import Class, Student, Fee, Expense, Concession, SubFee
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
		if student_data['scholarNumber']:
			student_object.scholarNumber = student_data['scholarNumber']
		if 'rollNumber' in student_data:
			student_object.rollNumber = student_data['rollNumber']
		if 'motherName' in student_data:
			student_object.motherName = student_data['motherName']
		if 'gender' in student_data:
			student_object.gender = student_data['gender']
		if 'caste' in student_data:
			student_object.caste = student_data['caste']
		if 'category' in student_data:
			student_object.category = student_data['category']
		if 'religion' in student_data:
			student_object.religion = student_data['religion']
		if 'fatherOccupation' in student_data:
			student_object.fatherOccupation = student_data['fatherOccupation']
		if 'address' in student_data:
			student_object.address = student_data['address']
		if 'familySSMID' in student_data:
			student_object.familySSMID = student_data['familySSMID']
		if 'childSSMID' in student_data:
			student_object.childSSMID = student_data['childSSMID']
		if 'bankName' in student_data:
			student_object.bankName = student_data['bankName']
		if 'bankAccountNum' in student_data:
			student_object.bankAccountNum = student_data['bankAccountNum']
		if 'aadharNum' in student_data:
			student_object.aadharNum = student_data['aadharNum']
		if 'bloodGroup' in student_data:
			student_object.bloodGroup = student_data['bloodGroup']
		if 'fatherAnnualIncome' in student_data:
			student_object.fatherAnnualIncome = student_data['fatherAnnualIncome']
		student_object.save()
		return JsonResponse({'data':'okay'})
	else:
		return JsonResponse({'data':'error'})

@api_view(['POST'])
def update_student_view(request):
	if request.user.is_authenticated:
		student_data = json.loads(request.body.decode('utf-8'))
		updatedValues = {}
		updatedValues['name'] = student_data['name']
		updatedValues['fathersName'] = student_data['fathersName']
		updatedValues['mobileNumber'] = student_data['mobileNumber']
		updatedValues['dateOfBirth'] = student_data['dateOfBirth']
		updatedValues['totalFees'] = student_data['totalFees']
		updatedValues['remark'] = student_data['remark']
		updatedValues['rollNumber'] = student_data['rollNumber']
		updatedValues['scholarNumber'] = student_data['scholarNumber']

		# new student profile data
		updatedValues['motherName'] = student_data['motherName']
		updatedValues['gender'] = student_data['gender']
		updatedValues['caste'] = student_data['caste']
		updatedValues['category'] = student_data['category']
		updatedValues['religion'] = student_data['religion']
		updatedValues['fatherOccupation'] = student_data['fatherOccupation']
		updatedValues['address'] = student_data['address']
		updatedValues['familySSMID'] = student_data['familySSMID']
		updatedValues['childSSMID'] = student_data['childSSMID']
		updatedValues['bankAccountNum'] = student_data['bankAccountNum']
		updatedValues['bankName'] = student_data['bankName']
		updatedValues['aadharNum'] = student_data['aadharNum']
		updatedValues['fatherAnnualIncome'] = student_data['fatherAnnualIncome']
		updatedValues['bloodGroup'] = student_data['bloodGroup']

		student_object, created = Student.objects.update_or_create(defaults=updatedValues,id=student_data['dbId'])
		student_data = get_student_data(student_object,request.user)
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
		SubFee.objects.filter(parentFee__parentStudent=student_object).delete()
		Fee.objects.filter(parentStudent=student_object).delete()
		Student.objects.filter(pk=request.data['studentDbId']).delete()
		response['studentDbId'] = request.data['studentDbId']
		response['message'] = 'Student Profile removed successfully.'
		return JsonResponse({'data': response})
	else:
		errResponse['message'] = 'You are not authenticated to delete student profile'
		return JsonResponse({'data': errResponse})



@api_view(['POST'])
def student_data_view(request):
	student_data = {}
	#if request.method == "POST":
	if request.user.is_authenticated:
		received_json_data = json.loads(request.body.decode('utf-8'))
		student_query = Student.objects.filter(id=received_json_data['dbId'])
		'''student_data['name'] = student_query[0].name
		student_data['dbId'] = student_query[0].id
		student_data['fathersName'] = student_query[0].fathersName
		student_data['mobileNumber'] = student_query[0].mobileNumber
		student_data['dateOfBirth'] = student_query[0].dateOfBirth
		student_data['totalFees'] = student_query[0].totalFees
		student_data['remark'] = student_query[0].remark
		student_data['rollNumber'] = student_query[0].rollNumber
		student_data['scholarNumber'] = student_query[0].scholarNumber
		student_data['class'] = student_query[0].parentClass.name
		student_data['feesList'] = []
		student_data['feesDue'] = student_query[0].totalFees
		#receiptNumberMax = Fee.objects.all().aggregate(Max('receiptNumber'))
		receiptNumberMax = Fee.objects.filter(parentStudent__parentClass__parentUser=request.user).aggregate(Max('receiptNumber'))
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
		student_data['concessionList'] = []
		for studentConcessionEntry in student_query[0].concession_set.all():
			tempStudentConcessionEntry = {}
			tempStudentConcessionEntry['amount'] = studentConcessionEntry.amount
			tempStudentConcessionEntry['remark'] = studentConcessionEntry.remark
			tempStudentConcessionEntry['generationDateTime'] = studentConcessionEntry.generationDateTime
			tempStudentConcessionEntry['studentDbId'] = studentConcessionEntry.parentStudent.id
			student_data['feesDue'] -= studentConcessionEntry.amount
			student_data['concessionList'].append(tempStudentConcessionEntry)'''
		student_data = get_student_data(student_query[0],request.user)
		return JsonResponse({'data':student_data})
	else:
		return JsonResponse({'data':'data'})

@api_view(['POST'])
def new_fee_receipt_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	if request.user.is_authenticated:
		response = {}
		response['status'] = 'success'
		fee_receipt = json.loads(request.body.decode('utf-8'))
		if Fee.objects.filter(receiptNumber=fee_receipt['receiptNumber']):
			errResponse['message'] = 'Failed: Receipt Number already exists'
			return JsonResponse({'data': errResponse})
		student_object = Student.objects.get(id=fee_receipt['studentDbId'])
		fee_receipt_object = Fee.objects.create(receiptNumber=fee_receipt['receiptNumber'],amount=fee_receipt['amount'],generationDateTime=fee_receipt['generationDateTime'],remark=fee_receipt['remark'],parentStudent=student_object)
		if fee_receipt['tuitionFeeAmount'] != 0:
			subFee_object = SubFee.objects.create(particular='TuitionFee', amount=fee_receipt['tuitionFeeAmount'], parentFee=fee_receipt_object)
		if fee_receipt['lateFeeAmount'] != 0:
			subFee_object = SubFee.objects.create(particular='LateFee', amount=fee_receipt['lateFeeAmount'], parentFee=fee_receipt_object)
		if fee_receipt['cautionMoneyAmount'] != 0:
			subFee_object = SubFee.objects.create(particular='CautionMoney', amount=fee_receipt['cautionMoneyAmount'], parentFee=fee_receipt_object)
		response['message'] = 'Fee submitted successfully'
		student_data = get_student_data(student_object,request.user)
		response['studentData'] = student_data
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

'''@api_view(['POST'])
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

			tempFee['tuitionFeeAmount'] = 0
			tuitionFee = SubFee.objects.filter(parentFee=fee,particular='TuitionFee')
			if tuitionFee:
				tempFee['tuitionFeeAmount'] = tuitionFee[0].amount

			tempFee['lateFeeAmount'] = 0
			lateFee = SubFee.objects.filter(parentFee=fee,particular='LateFee')
			if lateFee:
				tempFee['lateFeeAmount'] = lateFee[0].amount

			tempFee['cautionMoneyAmount'] = 0
			cautionMoney = SubFee.objects.filter(parentFee=fee,particular='CautionMoney')
			if cautionMoney:
				tempFee['cautionMoneyAmount'] = cautionMoney[0].amount

			tempFee['generationDateTime'] = fee.generationDateTime
			tempFee['studentName'] = fee.parentStudent.name
			tempFee['fatherName'] = fee.parentStudent.fathersName
			tempFee['className'] = fee.parentStudent.parentClass.name
			tempFee['remark'] = fee.remark
			fee_list.append(tempFee)
		return JsonResponse({'data':fee_list})
	else:
		return JsonResponse({'data':'error'})'''

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

@api_view(['POST'])
def new_concession_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	if request.method == "POST":
		response = {}
		response['status'] = 'success'
		concession = json.loads(request.body.decode('utf-8'))
		'''if Concession.objects.filter(receiptNumber=fee_receipt['receiptNumber']):
			errResponse['message'] = 'Failed: Receipt Number already exists'
			return JsonResponse({'data': errResponse})'''
		student_object = Student.objects.get(id=concession['studentDbId'])
		new_concession_object = Concession.objects.create(amount=concession['amount'],remark=concession['remark'],parentStudent=student_object)
		response['message'] = 'Concession submitted successfully'
		'''student_data = {}
		student_data['name'] = student_object.name
		student_data['dbId'] = student_object.id
		student_data['fathersName'] = student_object.fathersName
		student_data['mobileNumber'] = student_object.mobileNumber
		student_data['dateOfBirth'] = student_object.dateOfBirth
		student_data['totalFees'] = student_object.totalFees
		student_data['remark'] = student_object.remark
		student_data['rollNumber'] = student_object.rollNumber
		student_data['scholarNumber'] = student_object.scholarNumber
		student_data['class'] = student_object.parentClass.name
		student_data['feesList'] = []
		student_data['feesDue'] = student_object.totalFees
		receiptNumberMax = Fee.objects.filter(parentStudent__parentClass__parentUser=request.user).aggregate(Max('receiptNumber'))
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
		student_data['concessionList'] = []
		for studentConcessionEntry in student_object.concession_set.all():
			tempStudentConcessionEntry = {}
			tempStudentConcessionEntry['amount'] = studentConcessionEntry.amount
			tempStudentConcessionEntry['remark'] = studentConcessionEntry.remark
			tempStudentConcessionEntry['generationDateTime'] = studentConcessionEntry.generationDateTime
			tempStudentConcessionEntry['studentDbId'] = studentConcessionEntry.parentStudent.id
		student_data['feesDue'] -= studentConcessionEntry.amount
		student_data['concessionList'].append(tempStudentConcessionEntry)'''
		student_data = get_student_data(student_object, request.user)
		response['studentData'] = student_data
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

@api_view(['POST'])
def concession_list_view(request):
	if request.user.is_authenticated:
		concession_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		concession_query = Concession.objects.filter(parentStudent__parentClass__parentUser=request.user,generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])
		for concession in concession_query:
			tempConcession = {}
			tempConcession['amount'] = concession.amount
			tempConcession['generationDateTime'] = concession.generationDateTime
			tempConcession['studentName'] = concession.parentStudent.name
			tempConcession['fatherName'] = concession.parentStudent.fathersName
			tempConcession['className'] = concession.parentStudent.parentClass.name
			tempConcession['remark'] = concession.remark
			concession_list.append(tempConcession)
		return JsonResponse({'data':concession_list})
	else:
		return JsonResponse({'data':'error'})

def get_student_data(student_object, user):
		student_data = {}
		student_data['name'] = student_object.name
		student_data['dbId'] = student_object.id
		student_data['fathersName'] = student_object.fathersName
		student_data['mobileNumber'] = student_object.mobileNumber
		student_data['dateOfBirth'] = student_object.dateOfBirth
		student_data['totalFees'] = student_object.totalFees
		student_data['remark'] = student_object.remark
		student_data['rollNumber'] = student_object.rollNumber
		student_data['scholarNumber'] = student_object.scholarNumber
		student_data['classDbId'] = student_object.parentClass.id
		student_data['className'] = student_object.parentClass.name

		# new student profile data
		student_data['motherName'] = student_object.motherName
		student_data['gender'] = student_object.gender
		student_data['caste'] = student_object.caste
		student_data['category'] = student_object.category
		student_data['religion'] = student_object.religion
		student_data['fatherOccupation'] = student_object.fatherOccupation
		student_data['address'] = student_object.address
		student_data['familySSMID'] = student_object.familySSMID
		student_data['childSSMID'] = student_object.childSSMID
		student_data['bankName'] = student_object.bankName
		student_data['bankAccountNum'] = student_object.bankAccountNum
		student_data['aadharNum'] = student_object.aadharNum
		student_data['bloodGroup'] = student_object.bloodGroup
		student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome

		student_data['feesList'] = []
		student_data['feesDue'] = student_object.totalFees
		receiptNumberMax = Fee.objects.filter(parentStudent__parentClass__parentUser=user).aggregate(Max('receiptNumber'))
		student_data['overAllLastFeeReceiptNumber'] = receiptNumberMax['receiptNumber__max']
		for studentFeeEntry in student_object.fee_set.all():
			tempStudentFeeEntry = {}
			tempStudentFeeEntry['receiptNumber'] = studentFeeEntry.receiptNumber
			tempStudentFeeEntry['amount'] = studentFeeEntry.amount
			tempStudentFeeEntry['remark'] = studentFeeEntry.remark
			tempStudentFeeEntry['generationDateTime'] = studentFeeEntry.generationDateTime
			tempStudentFeeEntry['studentDbId'] = studentFeeEntry.parentStudent.id

			tempStudentFeeEntry['tuitionFeeAmount'] = 0
			tuitionFee = SubFee.objects.filter(parentFee=studentFeeEntry,particular='TuitionFee')
			if tuitionFee:
				tempStudentFeeEntry['tuitionFeeAmount'] = tuitionFee[0].amount

			tempStudentFeeEntry['lateFeeAmount'] = 0
			lateFee = SubFee.objects.filter(parentFee=studentFeeEntry,particular='LateFee')
			if lateFee:
				tempStudentFeeEntry['lateFeeAmount'] = lateFee[0].amount

			tempStudentFeeEntry['cautionMoneyAmount'] = 0
			cautionMoney = SubFee.objects.filter(parentFee=studentFeeEntry,particular='CautionMoney')
			if cautionMoney:
				tempStudentFeeEntry['cautionMoneyAmount'] = cautionMoney[0].amount

			student_data['feesDue'] -= tempStudentFeeEntry['amount']
			student_data['feesDue'] += tempStudentFeeEntry['lateFeeAmount']
			student_data['feesList'].append(tempStudentFeeEntry)
		student_data['concessionList'] = []
		for studentConcessionEntry in student_object.concession_set.all():
			tempStudentConcessionEntry = {}
			tempStudentConcessionEntry['amount'] = studentConcessionEntry.amount
			tempStudentConcessionEntry['remark'] = studentConcessionEntry.remark
			tempStudentConcessionEntry['generationDateTime'] = studentConcessionEntry.generationDateTime
			tempStudentConcessionEntry['studentDbId'] = studentConcessionEntry.parentStudent.id
			student_data['feesDue'] -= studentConcessionEntry.amount
			student_data['concessionList'].append(tempStudentConcessionEntry)
		return student_data

@api_view(['GET'])
def student_data_class_list_view(request):
	if request.user.is_authenticated:

		student_list = []
		student_query = Student.objects.filter(parentClass__parentUser=request.user).order_by('parentClass__orderNumber')
		for student in student_query:
			tempStudent = get_student_profile(student, request.user)
			student_list.append(tempStudent)

		class_query = request.user.class_set.all().order_by('orderNumber')
		classList = []
		#tempClass = {}
		#tempClass['name'] = 'All Classes'
		#tempClass['dbId'] = 0
		#classList.append(tempClass)
		for classs in class_query:
			tempClass = {}
			tempClass['name'] = classs.name
			tempClass['dbId'] = classs.id
			classList.append(tempClass)

		response = {}
		response['studentList'] = student_list
		response['classList'] = classList
		return JsonResponse({'data':response})
	else:
		return JsonResponse({'data':'error'})

def get_student_profile(student_object, user):
		student_data = {}
		student_data['name'] = student_object.name
		student_data['dbId'] = student_object.id
		student_data['fathersName'] = student_object.fathersName
		student_data['mobileNumber'] = student_object.mobileNumber
		student_data['dateOfBirth'] = student_object.dateOfBirth
		student_data['totalFees'] = student_object.totalFees
		student_data['remark'] = student_object.remark
		student_data['rollNumber'] = student_object.rollNumber
		student_data['scholarNumber'] = student_object.scholarNumber
		student_data['classDbId'] = student_object.parentClass.id
		student_data['className'] = student_object.parentClass.name

		# new student profile data
		student_data['motherName'] = student_object.motherName
		student_data['gender'] = student_object.gender
		student_data['caste'] = student_object.caste
		student_data['category'] = student_object.category
		student_data['religion'] = student_object.religion
		student_data['fatherOccupation'] = student_object.fatherOccupation
		student_data['address'] = student_object.address
		student_data['familySSMID'] = student_object.familySSMID
		student_data['childSSMID'] = student_object.childSSMID
		student_data['bankName'] = student_object.bankName
		student_data['bankAccountNum'] = student_object.bankAccountNum
		student_data['aadharNum'] = student_object.aadharNum
		student_data['bloodGroup'] = student_object.bloodGroup
		student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome

		student_data['feesDue'] = student_object.totalFees
		for studentFeeEntry in student_object.fee_set.all():
			lateFeeAmount = 0
			lateFee = SubFee.objects.filter(parentFee=studentFeeEntry,particular='LateFee')
			if lateFee:
				lateFeeAmount = lateFee[0].amount

			student_data['feesDue'] -= studentFeeEntry.amount
			student_data['feesDue'] += lateFeeAmount
		for studentConcessionEntry in student_object.concession_set.all():
			student_data['feesDue'] -= studentConcessionEntry.amount
		return student_data

