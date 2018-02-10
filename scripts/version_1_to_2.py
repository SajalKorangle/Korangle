from school_app.models import Session, Class, Student, SessionClass

SessionClass.objects.all().delete()
Session.objects.all().delete()

#Populating Session Model for Session 2017-18
tempSession = Session()
tempSession.startDate = '2017-04-01'
tempSession.endDate = '2018-03-30'
tempSession.save()

#Populating Session Model for Session 2018-19
tempSession = Session()
tempSession.startDate = '2018-04-01'
tempSession.endDate = '2019-03-30'
tempSession.save()

from school_app.session import get_current_session_object
current_session_object = get_current_session_object()

#Populating SessionClass Model for both sessions created above
for class_object in Class.objects.all():
	for session_object in Session.objects.all():
		tempSessionClass = SessionClass()
		tempSessionClass.parentClass = class_object
		tempSessionClass.parentSession = session_object
		tempSessionClass.save()

for student_object in Student.objects.all():
	student_object.parentUser = student_object.parentClass.parentUser
	student_object.save()
	for session_class_object in SessionClass.objects.filter(parentSession=current_session_object, parentClass=student_object.parentClass):
		student_object.sessionClass.add(session_class_object)
		student_object.save()

