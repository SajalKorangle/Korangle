
from .models import Session

import datetime

def get_current_session_object():
	today = datetime.date.today()
	session_queryset = Session.objects.filter(startDate__lte=today,endDate__gte=today)
	if len(session_queryset) == 0:
		print('there should be a session for today.')
	return session_queryset[0]
