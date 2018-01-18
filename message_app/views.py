from django.views.generic import ListView
from .models import Class, Subject, Chapter, Question, SubQuestion, Paper, PaperElement
from django.http import HttpResponse, JsonResponse
from django.core import serializers

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

from helloworld_project.settings import PROJECT_ROOT

from django.core.mail.message import EmailMessage

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

import json

import os

""" @api_view(['GET'])
def print_user_name_view(request):
	print(request.user)
	print(request.META)
	return JsonResponse({"message": "Hello World of free ruler!"})

class HelloWorldView(APIView):
	def get(self, request):
		print(request.user)
		return Response({"message": "Hello World!"}) """

class AuthenticationHandler():
	def authenticate_and_login(username, response):
		if 'token' in response.data:
			user = User.objects.filter(username=username)
			response.data['username'] = user[0].username
			response.data['email'] = user[0].email
		else:
			response.data['username'] = 'invalidUsername'
			response.data['email'] = 'invalidEmail'

class LoginUserView(JSONWebTokenAPIView):
	serializer_class = JSONWebTokenSerializer

	# @request_processor(fields=['username'])
	def post(self, request, *args, **kwargs):
		username = request.data['username']
		if username:
			username = str(username).lower()
			request.data['username'] = username
		response = super().post(request)

		print(response)

		AuthenticationHandler.authenticate_and_login(
				username=username,
				response=response
		)
		return Response({"data": response.data})
		# return APIResponse(data=response.data, status=status.HTTP_200_OK)

class UserDetailsView(APIView):
	def get(self, request):
		userDetails = {}
		print(request.user)
		if request.user.is_authenticated:
			userDetails['username'] = request.user.username
			userDetails['email'] = request.user.email
		return Response({"data": userDetails})

class NewUserView(JSONWebTokenAPIView):
	serializer_class = JSONWebTokenSerializer

	def post(self, request, *args, **kwargs):

		username = request.data['username']
		password = request.data['password']
		errResponse = {}

		if username:
			username = str(username).lower()
			request.data['username'] = username
		else:
			errResponse['status'] = 'fail'
			errResponse['message'] = 'Invalid Username'
			return Response({'data': errResponse})

		""" if email:
			email = str(email).lower()
			request.data['email'] = email
		else:
			errResponse['status'] = 'fail'
			errResponse['message'] = 'Invalid Email Id'
			return Response({'data': errResponse}) """

		if User.objects.filter(username=username):
			errResponse['status'] = 'fail'
			errResponse['message'] = 'Username: ' + username + ' already exists'
			return Response({'data': errResponse})

		""" if User.objects.filter(email=email):
			errResponse['status'] = 'fail'
			errResponse['message'] = 'Email Id: ' + email + ' is already registered with some other account'
			return Response({'data': errResponse}) """

		if User.objects.create_user(username=username,password=password):
			print('user created successfully')
		else:
			errResponse['status'] = 'fail'
			errResponse['message'] = 'Account creation failed.'
			return Response({'data': errResponse})

		response = super().post(request)

		response.data['username'] = username
		response.data['status'] = 'success'
		print(response)

		""" AuthenticationHandler.authenticate_and_login(
				username=username,
				response=response
		) """
		return Response({"data": response.data})

	""" def get(self, request):
		username = 'tempuser3'
		password = 'hars'
		if User.objects.filter(username=username):
			return Response({'data': 'Username: ' + username + ' already exists'})
		newUser = User.objects.create_user(username=username,password=password)
		print(username)
		return Response({"data": username}) """

""" @api_view(["GET"])
def hello_world(request):
	return Response({"message": "Hello World!"}) """

# Create your views here.
def indices_view(request):
	queryset = Class.objects.all()
	indices = []
	for level in queryset:
		tempClass = {} 
		tempClass['name'] = level.name
		tempClass['subjectList'] = []
		for subject in level.subject_set.all():
			tempSubject = {}
			tempSubject['name'] = subject.name
			tempSubject['chapterList'] = []
			for chapter in subject.chapter_set.all():
				tempChapter = {} 
				tempChapter['name'] = chapter.name
				tempChapter['chapterId'] = chapter.id
				tempSubject['chapterList'].append(tempChapter)
			tempClass['subjectList'].append(tempSubject)
		indices.append(tempClass)

	return JsonResponse({'data':indices})
	
def questions_view(request):
	indices = []
	if request.method == "POST":
		received_json_data=json.loads(request.body.decode('utf-8'))
		print(received_json_data)
		for question in Question.objects.filter(parentChapter__id=received_json_data['chapterId']):
			tempQuestion = {}
			tempQuestion['content'] = question.content
			tempQuestion['dbId'] = question.id
			tempQuestion['chapterId'] = question.parentChapter.id
			tempQuestion['list'] = []
			for subQuestion in question.subquestion_set.all():
				tempSubQuestion = {}
				tempSubQuestion['content'] = subQuestion.content
				tempSubQuestion['dbId'] = subQuestion.id
				tempQuestion['list'].append(tempSubQuestion)
			indices.append(tempQuestion)
	else:
		for question in Question.objects.all():
			tempQuestion = {}
			tempQuestion['content'] = question.content
			tempQuestion['dbId'] = question.id
			tempQuestion['chapterId'] = question.parentChapter.id
			tempQuestion['list'] = []
			for subQuestion in question.subquestion_set.all():
				tempSubQuestion = {}
				tempSubQuestion['content'] = subQuestion.content
				tempSubQuestion['dbId'] = subQuestion.id
				tempQuestion['list'].append(tempSubQuestion)
			indices.append(tempQuestion)
	return JsonResponse({'data':indices})

'''def insert_chapter_data(request):
	chapters = ['The Fun They Had','The Road Not Taken','The Sound of Music','Wind','The Little Girl','Rain on the Roof','A Truly Beautiful Mind','The Lake Isle of Innisfree','The Snake and the Mirror','A Legend of the Northland','My Childhood','No Men Are Foreign','Packing','The Duck and the Kangaroo','Reach for the Top','On Killing a Tree','The Bond of Love','The Snake Trying','Kathmandu','A Slumber did My Spirit Seal','If I were you']
	subject = Subject.objects.filter(name='English',parentClass__name='Class - IX')
	for chapter in chapters:
		data = Chapter.objects.create(name=chapter,parentSubject=subject[0])
	return JsonResponse({'data':subject[0].name});

def insert_question_data(request):
	subject = Subject.objects.filter(name='English',parentClass__name='Class - IX')
	chapter = Chapter.objects.get_or_create(name='"The Fun They Had"',parentSubject=subject[0])
	return JsonResponse({'data':chapter[0].name});

def create_database(request):
	for entry in data:
		classes = Class.objects.get_or_create(name=entry['classs'])
		subject = Subject.objects.get_or_create(name=entry['subject'],parentClass=classes[0])
		chapter = Chapter.objects.get_or_create(name=entry['chapter'],parentSubject=subject[0])
		question = Question.objects.get_or_create(content=entry['question'],parentChapter=chapter[0])
		subQuestion = SubQuestion.objects.get_or_create(content=entry['subquestion'],parentQuestion=question[0])
	return JsonResponse({'data':'okay'})

def read_file_test(request):
	classs = Class.objects.filter(name='Class - IX')
	subject = Subject.objects.filter(name='English - A',parentClass=classs)
	chapter = Chapter.objects.filter(name='The Fun They Had',parentSubject=subject)
	question = Question.objects.filter(content='',parentChapter=chapter)
	file_ = open(os.path.join(PROJECT_ROOT, 'ninthEnglish'))
	data = file_.read().split('\n')
	index = 0
	while index < len(data):
		if data[index].startswith("chapter: "):
			chapterName = data[index][9:].rstrip('\n')
			chapter = Chapter.objects.get_or_create(name=chapterName,parentSubject=subject[0])
			index += 1
		elif data[index].startswith("question: "):
			questionContent = data[index][10:].rstrip('\n')
			index += 1
			while data[index].startswith("simple: "):
				questionContent += "<br/>" + data[index][8:].rstrip('\n')
				index += 1
			question = Question.objects.get_or_create(content=questionContent,parentChapter=chapter[0])
		elif data[index].startswith("subquestion: "):
			subquestionContent = data[index][13:].rstrip('\n')
			index += 1
			while data[index].startswith("simple: "):
				subquestionContent += "<br/>" + data[index][8:].rstrip('\n')
				index += 1
			subquestion = SubQuestion.objects.get_or_create(content=subquestionContent,parentQuestion=question[0])
		else:
			return JsonResponse({'data':'Error'})
	return JsonResponse({'data':subject[0].name+"-"+subject[0].parentClass.name})

def update_database_backup(request):
	classs = Class.objects.filter(name='Class - X')
	subject = Subject.objects.filter(name='English',parentClass=classs)
	file_ = open(os.path.join(PROJECT_ROOT, 'ninthEnglish'))
	data = "<br/>".join(file_.read().split("\n"))
	subjectData = data
	while True:
		chapterStartIndex = subjectData.find('cpro')
		chapterEndIndex = -1
		chapterData = ""
		if chapterStartIndex == -1:
			break;
		else:
			chapterEndIndex = subjectData[chapterStartIndex+4:].find('cpro')
			if chapterEndIndex == -1:
				chapterData = subjectData[chapterStartIndex:]
				subjectData = ""
			else:
				chapterData = subjectData[chapterStartIndex:chapterEndIndex]
				subjectData = subjectData[chapterEndIndex:]
		chapterName = getString(chapterData,'cpro','pcro')
		# chapter = Chapter.objects.get_or_create(name=chapterName,parentSubject=subject)
		print(chapterName)
		while True:
			questionStartIndex = chapterData.find('qpro')
			questionEndIndex = -1
			questionData = ""
			if questionStartIndex == -1:
				break;
			else:
				questionEndIndex = chapterData[questionStartIndex+4:].find('qpro')
	nice = data.find('cpro')
	okay = data.find('pcro')
	wow = data.find('cpron')
	return JsonResponse({'data':wow})

def update_database(request):
	classs = Class.objects.filter(name='Class - XII')
	subject = Subject.objects.filter(name='English - Reading/Writing',parentClass=classs)
	file_ = open(os.path.join(PROJECT_ROOT, 'ninthEnglish'))
	# data = "<br/>".join(file_.read().split("\n"))
	data = file_.read()
	subjectData = data
	while True:
		sectionData = getSection(subjectData,'cpro','pcro')
		chapterData = sectionData['section']
		subjectData = sectionData['parentSection']
		chapterName = sectionData['name']
		if chapterData == '':
			break;
		print(chapterName)
		# chapter = Chapter.objects.get_or_create(name=chapterName,parentSubject=subject[0])
		while True:
			sectionData = getSection(chapterData,'qpro','pqro')
			questionData = sectionData['section']
			chapterData = sectionData['parentSection']
			questionContent = sectionData['name']
			if questionData == '':
				break;
			print(questionContent)
			# question = Question.objects.get_or_create(content=questionContent,parentChapter=chapter[0])
			while True:
				sectionData = getSection(questionData,'xpro','pxro')
				subquestionData = sectionData['section']
				questionData = sectionData['parentSection']
				subquestionContent = sectionData['name']
				if subquestionData == '':
					break;
				print(subquestionContent)
				# subquestion = SubQuestion.objects.get_or_create(content=subquestionContent,parentQuestion=question[0])
	return JsonResponse({'data':'okay'})

def getSection(parentSection,startTag,endTag):
	startIndex = parentSection.find(startTag)
	endIndex = -1
	name = ''
	section = ''
	if startIndex == -1:
		return { 'name': name, 'section': section, 'parentSection': parentSection }
	else:
		endIndex = parentSection[startIndex+4:].find(startTag)
		if endIndex == -1:
			section = parentSection[startIndex:]
			parentSection = ''
		else:
			section = parentSection[startIndex:startIndex+4+endIndex]
			parentSection = parentSection[startIndex+4+endIndex:]
	name = getString(section,startTag,endTag)
	return { 'name': name, 'section': section, 'parentSection': parentSection }

def getString(parentString,startTag,endTag):
	startIndex = parentString.find(startTag)
	endIndex = parentString.find(endTag)
	return parentString[startIndex+4:endIndex]'''

'''@api_view(['GET'])
def test_user_view(request):
	print(request.user)
	# email = EmailMessage( subject='Test Email', body='It\'s working', from_email='admin@qlib.co.in', to=['harshalagrawal03@gmail.com'])
	""" email = EmailMessage( subject='Test Email', body='It\'s working', from_email='admin@qlib.co.in', to=['adminoskflsdf@qlib.co.in'])
	checking = email.send()
	print(checking) """
	return JsonResponse({"data": "okay"})'''

@api_view(['POST'])
def delete_paper(request):
	paperDbId = request.data['paperDbId']
	response = {}
	errResponse = {}
	response['status'] = 'success'
	errResponse['status'] = 'fail'
	try:
		oldPaper = Paper.objects.get(pk=paperDbId,parentUser=request.user)
	except ObjectDoesNotExist:
		errResponse['message'] = 'This paper either doesn\'t exist or is deleted from user\'s library.'
		return JsonResponse({"data": errResponse})
	except MultipleObjectsReturned:
		errResponse['message'] = 'Multiple papers of same type for this user, contact site admin.'
		return JsonResponse({"data": errResponse})
	except:
		errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
		return JsonResponse({"data": errResponse})
	PaperElement.objects.filter(parentPaper=oldPaper).delete()
	Paper.objects.filter(pk=paperDbId,parentUser=request.user).delete()
	response['message'] = 'Paper deleted successfully'
	response['paperDbId'] = paperDbId
	return JsonResponse({'data': response})

@api_view(['POST'])
def save_paper(request):
	paper = request.data['paper']
	response = {}
	errResponse = {}
	errResponse['status'] = 'fail'
	if paper['dbId'] == 0:
		print('new paper')
		newPaper = Paper.objects.create(parentUser = request.user,
														showRollNumber=paper['showRollNumber'],
														showCode=paper['showCode'],
														code=paper['code'],
														heading=paper['heading'],
														time=paper['time'],
														totalMarks=paper['totalMarks'])
		paperElementCount = 1
		for paperElement in paper['list']:
			if paperElement['type'] == 'question':
				newQuestion = PaperElement.objects.create(parentPaper=newPaper,
																									elementDbId=paperElement['dbId'],
																									elementContent=paperElement['content'],
																									elementNumber=paperElementCount,
																									elementType='question',
																									elementMarks=paperElement['marks'])
				paperElementCount += 1
				for subQuestion in paperElement['list']:
					newSubQuestion = PaperElement.objects.create(parentPaper=newPaper,
																											elementDbId=subQuestion['dbId'],
																											elementContent=subQuestion['content'],
																											elementNumber=paperElementCount,
																											elementType='subquestion',
																											elementMarks=subQuestion['marks'])
					paperElementCount += 1
			elif paperElement['type'] == 'section':
				newSection = PaperElement.objects.create(parentPaper=newPaper,
																									elementContent=paperElement['content'],
																									elementNumber=paperElementCount,
																									elementType='section')
				paperElementCount += 1
			elif paperElement['type'] == 'or':
				newOr = PaperElement.objects.create(parentPaper=newPaper,
																						elementContent=paperElement['content'],
																						elementNumber=paperElementCount,
																						elementType='or')
				paperElementCount += 1
			else:
				print('Error -> Paper Element type: ' + paperElement['type'] + ' isn\'t valid.')
		response['status'] = 'success'
		response['paperDbId'] = newPaper.pk
		response['message'] = 'Paper created successfully'
		return JsonResponse({"data": response})
	else:
		print('old paper')
		try:
			oldPaper = Paper.objects.get(pk=paper['dbId'],parentUser=request.user)
		except ObjectDoesNotExist:
			errResponse['message'] = 'This paper either doesn\'t exist or is deleted from user\'s library.'
			return JsonResponse({"data": errResponse})
		except MultipleObjectsReturned:
			errResponse['message'] = 'Multiple papers of same type for this user, contact site admin.'
			return JsonResponse({"data": errResponse})
		except:
			errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
			return JsonResponse({"data": errResponse})
		oldPaper.showRollNumber = paper['showRollNumber']
		oldPaper.showCode = paper['showCode']
		oldPaper.code = paper['code']
		oldPaper.heading = paper['heading']
		oldPaper.time = paper['time']
		oldPaper.totalMarks = paper['totalMarks']
		oldPaper.save()
		paperElementQuerySet = PaperElement.objects.filter(parentPaper=oldPaper).delete()
		paperElementCount = 1
		for paperElement in paper['list']:
			if paperElement['type'] == 'question':
				newQuestion = PaperElement.objects.create(parentPaper=oldPaper,
																									elementDbId=paperElement['dbId'],
																									elementContent=paperElement['content'],
																									elementNumber=paperElementCount,
																									elementType='question',
																									elementMarks=paperElement['marks'])
				paperElementCount += 1
				for subQuestion in paperElement['list']:
					newSubQuestion = PaperElement.objects.create(parentPaper=oldPaper,
																											elementDbId=subQuestion['dbId'],
																											elementContent=subQuestion['content'],
																											elementNumber=paperElementCount,
																											elementType='subquestion',
																											elementMarks=subQuestion['marks'])
					paperElementCount += 1
			elif paperElement['type'] == 'section':
				newSection = PaperElement.objects.create(parentPaper=oldPaper,
																									elementContent=paperElement['content'],
																									elementNumber=paperElementCount,
																									elementType='section')
				paperElementCount += 1
			elif paperElement['type'] == 'or':
				newOr = PaperElement.objects.create(parentPaper=oldPaper,
																									elementContent=paperElement['content'],
																						elementNumber=paperElementCount,
																						elementType='or')
				paperElementCount += 1
			else:
				print('Error -> Paper Element type: ' + paperElement['type'] + ' isn\'t valid.')
		response['status'] = 'success'
		response['paperDbId'] = oldPaper.pk
		response['message'] = 'Paper saved successfully'
		return JsonResponse({"data": response})

@api_view(['GET'])
def get_paper_list(request):
	user = request.user
	paperList = []
	for paper in user.paper_set.all():
		tempPaper = {}
		tempPaper['dbId'] = paper.pk
		tempPaper['heading'] = paper.heading
		tempPaper['time'] = paper.time
		tempPaper['totalMarks'] = paper.totalMarks
		tempPaper['totalQuestions'] = paper.paperelement_set.filter(elementType='question').count() - paper.paperelement_set.filter(elementType='or').count()
		paperList.append(tempPaper)
	return JsonResponse({"data": paperList})

@api_view(['POST'])
def get_paper(request):
	response = {}
	errResponse = {}
	errResponse['status'] = 'fail'
	try:
		paper = Paper.objects.get(pk=request.data['paperDbId'],parentUser=request.user)
	except ObjectDoesNotExist:
		errResponse['message'] = 'This paper doesn\'t exist for this user, contact site admin.'
		return JsonResponse({"data": errResponse})
	except MultipleObjectsReturned:
		errResponse['message'] = 'Multiple papers of same type for this user, contact site admin.'
		return JsonResponse({"data": errResponse})
	except:
		errResponse['message'] = 'Unknown Exception while accessing the paper, contact site admin.'
		return JsonResponse({"data": errResponse})

	responsePaper = {}
	responsePaper['dbId'] = request.data['paperDbId']
	responsePaper['showRollNumber'] = paper.showRollNumber
	responsePaper['showCode'] = paper.showCode
	responsePaper['code'] = paper.code
	responsePaper['heading'] = paper.heading
	responsePaper['time'] = paper.time
	responsePaper['totalMarks'] = paper.totalMarks
	responsePaper['list'] = []

	previousQuestion = {}

	for paperElement in paper.paperelement_set.all().order_by('elementNumber'):
		tempPaperElement = {}
		if paperElement.elementType == 'question':
			tempPaperElement['type'] = 'question'
			tempPaperElement['dbId'] = paperElement.elementDbId
			tempPaperElement['content'] = paperElement.elementContent
			tempPaperElement['marks'] = paperElement.elementMarks
			tempPaperElement['list'] = []
			previousQuestion = tempPaperElement
			responsePaper['list'].append(tempPaperElement)
		elif paperElement.elementType == 'subquestion':
			tempPaperElement['type'] = 'question'
			tempPaperElement['dbId'] = paperElement.elementDbId
			tempPaperElement['content'] = paperElement.elementContent
			tempPaperElement['marks'] = paperElement.elementMarks
			previousQuestion['list'].append(tempPaperElement)
		elif paperElement.elementType == 'or':
			tempPaperElement['type'] = 'or'
			tempPaperElement['content'] = paperElement.elementContent
			responsePaper['list'].append(tempPaperElement)
		elif paperElement.elementType == 'section':
			tempPaperElement['type'] = 'section'
			tempPaperElement['content'] = paperElement.elementContent
			responsePaper['list'].append(tempPaperElement)

	response['status'] = 'success'
	response['paper'] = responsePaper

	return JsonResponse({'data': response})

import pdfkit

import os
import argparse

from .pdfrwmaster.pdfrw import PdfReader, PdfWriter, PageMerge

@api_view(['POST'])
def print_booklet(request):
	if request.method == "POST":

		#print(request.data['paper'])

		pdfkit.from_string(request.data['paper'],'./helloworld_project/media/Gig.pdf')

		inpfn = './helloworld_project/media/Gig.pdf'
		outfn = './helloworld_project/media/booklet.' + os.path.basename(inpfn)
		ipages = PdfReader(inpfn).pages

		blankPages = PdfReader('./helloworld_project/media/onepage.pdf').pages
		blankPage = blankPages.pop()

		pad_to = 4
		'''if args.padding:
				pad_to = 4
		else:
				pad_to = 2'''

    # Make sure we have a correct number of sides
		#ipages += [None]*(-len(ipages)%pad_to)
		ipages += [blankPage]*(-len(ipages)%pad_to)

		opages = []
		while len(ipages) > 2:
				opages.append(fixpage(ipages.pop(), ipages.pop(0)))
				opages.append(fixpage(ipages.pop(0), ipages.pop()))

		opages += ipages

		PdfWriter(outfn).addpages(opages).write()

		# blob = PdfReader('./message_app/pdf_files/booklet.Gig.pdf').pages

		return JsonResponse({'data': 'media/booklet.Gig.pdf'})
	else:
		return JsonResponse({'data': 'error'})

def fixpage(*pages):
    result = PageMerge() + (x for x in pages if x is not None)
    result[-1].x += result[0].w
    return result.render()

