
from .models import Fee, SubFee
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

import json

@api_view(['POST'])
def fee_list_view(request):
	if request.user.is_authenticated:
		fee_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		fee_query = Fee.objects.filter(parentStudent__parentClass__parentUser=request.user,generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate']).order_by('generationDateTime','receiptNumber')
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
		return JsonResponse({'data':'error'})

