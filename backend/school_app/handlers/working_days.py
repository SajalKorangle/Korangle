
from school_app.model.models import SchoolSession

from django.core.exceptions import ObjectDoesNotExist


def get_working_days(data):

    try:
        school_session_object = SchoolSession.objects.get(parentSchool_id=data['schoolDbId'], parentSession_id=data['sessionDbId'])

        data = {}
        data['schoolSessionDbId'] = school_session_object.id
        data['workingDays'] = school_session_object.workingDays

        return data
    except ObjectDoesNotExist:

        return None

def create_working_days(data):

    school_session_object = SchoolSession(parentSchool_id=data['schoolDbId'], parentSession_id=data['sessionDbId'], workingDays=data['workingDays'])
    school_session_object.save()

    data = {}
    data['schoolSessionDbId'] = school_session_object.id
    data['workingDays'] = school_session_object.workingDays

    return data

def update_working_days(data):

    school_session_object = SchoolSession.objects.get(id=data['schoolSessionDbId'])
    school_session_object.workingDays=data['workingDays']
    school_session_object.save()

    return 'Working Days updated successfully'