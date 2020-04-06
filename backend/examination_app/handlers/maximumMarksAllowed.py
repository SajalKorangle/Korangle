
from examination_app.models import MaximumMarksAllowed

def get_maximumMarksAllowed():

    response = []

    for marks_object in MaximumMarksAllowed.objects.all():
        tempMarks = {}
        tempMarks['dbId'] = marks_object.id
        tempMarks['marks'] = marks_object.marks
        response.append(tempMarks)

    return response