from django.views.generic import ListView
from .models import Class, Subject, Chapter, Question, SubQuestion
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from helloworld_project.settings import PROJECT_ROOT

import json

import os

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

def insert_chapter_data(request):
	"""data = Class(name = 'Class - III')
	data.save()
	classes = Class.objects.filter(name='Class - III')
	data = Subject.objects.create(name = 'English',parentClass=classes[0])"""
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
	"""return JsonResponse({'data':len(data))})"""

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
	return parentString[startIndex+4:endIndex]
