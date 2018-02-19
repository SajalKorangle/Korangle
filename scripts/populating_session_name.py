from school_app.models import Session

session_queryset = Session.objects.all().order_by('id')

first_session_object = session_queryset[0]
first_session_object.name = 'Session 2017-18'
first_session_object.save()

second_session_object = session_queryset[1]
second_session_object.name = 'Session 2018-19'
second_session_object.save()
