
from .models import Session, SessionClass

import datetime

def get_current_session_object():
	today = datetime.date.today()
	session_queryset = Session.objects.filter(startDate__lte=today,endDate__gte=today)
	if len(session_queryset) == 0:
		print('there should be a session for today.')
	return session_queryset[0]

def get_session_class_list(user):
	session_list = []
	for sessionClass_object in SessionClass.objects.filter(parentClass__parentUser=user).order_by('parentSession__id', 'parentClass__orderNumber'):
		session_object = sessionClass_object.parentSession
		class_object = sessionClass_object.parentClass
		if len(session_list) == 0:
			session_list.append(get_session_object(session_object,class_object))
		elif session_list[len(session_list)-1]['dbId'] == session_object.id:
			session_list[len(session_list)-1]['classList'].append(get_class_object(class_object))
		else:
			session_list.append(get_session_object(session_object,class_object))
	return session_list

def get_session_object(session_object,class_object):
	temp_session_object = {}
	temp_session_object['startDate'] = session_object.startDate
	temp_session_object['endDate'] = session_object.endDate
	temp_session_object['name'] = session_object.name
	temp_session_object['dbId'] = session_object.id
	temp_session_object['classList'] = []
	temp_session_object['classList'].append(get_class_object(class_object))
	return temp_session_object

def get_class_object(class_object):
	temp_class_object = {}
	temp_class_object['name'] = class_object.name
	temp_class_object['dbId'] = class_object.id
	return temp_class_object
