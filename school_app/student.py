
from .models import Class, Student, Session, SessionClass
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

import json

from .session import get_current_session_object

# current_session_object = get_current_session_object()

# Get Filtered Student List
'''@api_view(['POST'])
def get_student_filtered_list(request):

	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'

	if request.user.is_authenticated:

		student_list = []
		classDbId_list = request.data['classDbIdList']
		column_list = request.data['columnList']

		student_query = Student.objects.filter(parentUser=request.user,sessionClass__parentClass__pk__in=classDbId_list).order_by('sessionClass__parentClass__orderNumber', 'name')

		for student in student_query:
			tempStudent = {}

			if 'name' in column_list:
				tempStudent['name'] = student.name
			if 'fathersName' in column_list:
				tempStudent['fathersName'] = student.fathersName
			if 'mobileNumber' in column_list:
				tempStudent['mobileNumber'] = student.mobileNumber
			if 'rollNumber' in column_list:
				tempStudent['rollNumber'] = student.rollNumber
			if 'scholarNumber' in column_list:
				tempStudent['scholarNumber'] = student.scholarNumber
			if 'totalFees' in column_list:
				tempStudent['totalFees'] = student.totalFees
			if 'dateOfBirth' in column_list:
				tempStudent['dateOfBirth'] = student.dateOfBirth
			if 'remark' in column_list:
				tempStudent['remark'] = student.remark
			if 'className' in column_list:
				tempStudent['className'] = SessionClass.objects.filter(student=student,parentSession=get_current_session_object())[0].parentClass.className
			if 'motherName' in column_list:
				tempStudent['motherName'] = student.motherName
			if 'gender' in column_list:
				tempStudent['gender'] = student.gender
			if 'caste' in column_list:
				tempStudent['caste'] = student.caste
			if 'category' in column_list:
				tempStudent['category'] = student.newCategoryField
			if 'religion' in column_list:
				tempStudent['religion'] = student.religion
			if 'religion' in column_list:
				tempStudent['religion'] = student.newReligionField
			if 'fatherOccupation' in column_list:
				tempStudent['fatherOccupation'] = student.fatherOccupation
			if 'address' in column_list:
				tempStudent['address'] = student.address
			if 'familySSMID' in column_list:
				tempStudent['familySSMID'] = student.familySSMID
			if 'childSSMID' in column_list:
				tempStudent['childSSMID'] = student.childSSMID.className
			if 'bankName' in column_list:
				tempStudent['bankName'] = student.bankName.className
			if 'bankAccountNum' in column_list:
				tempStudent['bankAccountNum'] = student.bankAccountNum.className
			if 'aadharNum' in column_list:
				tempStudent['aadharNum'] = student.aadharNum.className
			if 'bloodGroup' in column_list:
				tempStudent['bloodGroup'] = student.bloodGroup.className
			if 'fatherAnnualIncome' in column_list:
				tempStudent['fatherAnnualIncome'] = student.fatherAnnualIncome.className

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
		return JsonResponse({'data':'error'})'''

