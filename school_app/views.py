from .models import Student, Fee, Expense, Concession, SubFee, Marks

from class_app.models import Class, ClassSession, Section

from django.http import JsonResponse

from .session import get_current_session_object

from django.db.models import Max

from rest_framework.decorators import api_view

import json

from student_app.handlers.common import get_student_profile_with_fee
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
		student_data = get_student_profile_with_fee(student_object,request.user)
		response['studentData'] = student_data
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

@api_view(['POST'])
def new_concession_view(request):
	errResponse = {}
	errResponse['status'] = 'fail'
	if request.method == "POST":
		response = {}
		response['status'] = 'success'
		concession = json.loads(request.body.decode('utf-8'))
		student_object = Student.objects.get(id=concession['studentDbId'])
		new_concession_object = Concession.objects.create(amount=concession['amount'],remark=concession['remark'],parentStudent=student_object)
		response['message'] = 'Concession submitted successfully'
		student_data = get_student_profile_with_fee(student_object, request.user)
		response['studentData'] = student_data
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data': errResponse})

@api_view(['POST'])
def concession_list_view(request):
	if request.user.is_authenticated:
		concession_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		'''concession_query = Concession.objects.filter(parentStudent__parentClass__parentUser=request.user,generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])'''
		concession_query = Concession.objects.filter(parentStudent__parentUser=request.user,generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'])
		for concession in concession_query:
			tempConcession = {}
			tempConcession['amount'] = concession.amount
			tempConcession['generationDateTime'] = concession.generationDateTime
			tempConcession['studentName'] = concession.parentStudent.name
			tempConcession['fatherName'] = concession.parentStudent.fathersName
			'''tempConcession['className'] = concession.parentStudent.parentClass.name'''
			'''tempConcession['className'] = SessionClass.objects.filter(student=concession.parentStudent,parentSession=get_current_session_object())[0].parentClass.name'''
			tempConcession['className'] = concession.parentStudent.friendSection\
				.get(parentClassSession__parentSession=get_current_session_object())\
				.parentClassSession.parentClass.name
			tempConcession['remark'] = concession.remark
			concession_list.append(tempConcession)
		return JsonResponse({'data':concession_list})
	else:
		return JsonResponse({'data':'error'})
