
from school_app.model.models import Session

# import datetime

'''def get_current_session_object():
	today = datetime.date.today()
	session_queryset = Session.objects.filter(startDate__lte=today,endDate__gte=today)
	if len(session_queryset) == 0:
		print('there should be a session for today.')
	return session_queryset[0]'''

def get_session_object(date):
	session_object = Session.objects.get(startDate__lte=date,endDate__gte=date)
	return session_object

def get_session_by_id(dbId):
	return Session.objects.get(id=dbId)
