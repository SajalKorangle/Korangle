
from subject_app.models import Subject

def subject_list():

    subject_list = []

    for subject_object in Subject.objects.all():
        tempSubject = {}
        tempSubject['dbId'] = subject_object.id
        tempSubject['name'] = subject_object.name
        subject_list.append(tempSubject)

    return subject_list
