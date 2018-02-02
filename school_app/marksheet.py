#from django.views.generic import ListView
#from django.http import HttpResponse
#from django.core import serializers
#from helloworld_project.settings import PROJECT_ROOT

#from django.db.models import Max

#from rest_framework.views import APIView
#from rest_framework.response import Response


#import os

from .models import Class, Student, Subject, Marks
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

import json

# Get Student Marksheet by studentDbId
@api_view(['POST'])
def get_student_marksheet(request):

	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'

	if request.user.is_authenticated:

		try:
			student = Student.objects.get(pk=request.data['studentDbId'])
		except ObjectDoesNotExist:
			errResponse['message'] = 'This student doesn\'t exist for this user, contact site admin.'
			return JsonResponse({"data": errResponse})
		except MultipleObjectsReturned:
			errResponse['message'] = 'Multiple students of same id, contact site admin.'
			return JsonResponse({"data": errResponse})
		except:
			errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
			return JsonResponse({"data": errResponse})

		marksheet = {}
		marksheet['studentDbId'] = student.id
		marksheet['marks'] = []

		subject_list = Subject.objects.filter(parentClass=student.parentClass)
		for subject in subject_list:
			tempMarks = {}
			tempMarks['subjectName'] = subject.name
			tempMarks['subjectId'] = subject.id
			tempMarks['marks'] = 0
			tempMarks['dbId'] = 0
			marks = Marks.objects.filter(parentSubject=subject, parentStudent=student)
			#if marks[0]:
			if len(marks) > 0:
				tempMarks['marks'] = marks[0].marks
				tempMarks['dbId'] = marks[0].id
			marksheet['marks'].append(tempMarks)

		return JsonResponse({'data': marksheet})

	else:
		errResponse['message'] = 'User not authenticated'
		return JsonResponse({'data': errResponse})
	
# Update Student Marksheet
@api_view(['POST'])
def update_student_marksheet(request):

	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'

	if request.user.is_authenticated:

		received_json_data = json.loads(request.body.decode('utf-8'))
		marksheet = received_json_data['marksheet']

		student = Student.objects.get(pk=marksheet['studentDbId'])

		responseMarksheet = {}
		responseMarksheet['studentDbId'] = student.id
		responseMarksheet['marks'] = []

		for marks in marksheet['marks']:
			
			subject_list = Subject.objects.filter(id=marks['subjectId'])

			if marks['dbId'] == 0:
				marks_tobeupdated = Marks(marks=marks['marks'],parentStudent=student,parentSubject=subject_list[0])
			else:
				marks_tobeupdated = Marks(id=marks['dbId'],marks=marks['marks'],parentStudent=student,parentSubject=subject_list[0])
			marks_tobeupdated.save()

			tempMarks = {}
			tempMarks['subjectName'] = marks_tobeupdated.parentSubject.name
			tempMarks['subjectId'] = marks_tobeupdated.parentSubject.id
			tempMarks['marks'] = marks_tobeupdated.marks
			tempMarks['dbId'] = marks_tobeupdated.id
			responseMarksheet['marks'].append(tempMarks)

		response['message'] = 'Marksheet updated successfully'

		return JsonResponse({'data': responseMarksheet})

	else:
		errResponse['message'] = 'User not authenticated'
		return JsonResponse({'data': errResponse})
	
# Delete Student Marksheet by studentDbId
@api_view(['POST'])
def delete_student_marksheet(request):

	errResponse = {}
	errResponse['status'] = 'fail'
	response = {}
	response['status'] = 'success'

	if request.user.is_authenticated:

		try:
			student = Student.objects.get(pk=request.data['studentDbId'])
		except ObjectDoesNotExist:
			errResponse['message'] = 'This student doesn\'t exist for this user, contact site admin.'
			return JsonResponse({"data": errResponse})
		except MultipleObjectsReturned:
			errResponse['message'] = 'Multiple students of same id, contact site admin.'
			return JsonResponse({"data": errResponse})
		except:
			errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
			return JsonResponse({"data": errResponse})

		Marks.objects.filter(parentStudent=student).delete()

		response['message'] = 'Student Marksheet deleted successfully'

		marksheet = {}
		marksheet['studentDbId'] = student.id
		marksheet['marks'] = []

		subject_list = Subject.objects.filter(parentClass=student.parentClass)
		for subject in subject_list:
			tempMarks = {}
			tempMarks['subjectName'] = subject.name
			tempMarks['subjectId'] = subject.id
			tempMarks['marks'] = 0
			tempMarks['dbId'] = 0
			marksheet['marks'].append(tempMarks)

		return JsonResponse({'data': marksheet})

	else:
		errResponse['message'] = 'User not authenticated'
		return JsonResponse({'data': errResponse})
