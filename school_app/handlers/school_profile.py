
from school_app.model.models import School, Session


'''def get_school_profile_by_id(data):
    
    school_object = School.objects.get(id=data['dbId'])
    
    return get_school_profile_by_object(school_object)'''


def get_school_profile_by_object(school_object):

    school_profile_response = {}

    school_profile_response['dbId'] = school_object.id
    school_profile_response['name'] = school_object.name
    school_profile_response['printName'] = school_object.printName
    school_profile_response['diseCode'] = school_object.diseCode
    school_profile_response['address'] = school_object.address
    school_profile_response['registrationNumber'] = school_object.registrationNumber
    school_profile_response['currentSessionDbId'] = school_object.currentSession.id

    return school_profile_response


def update_school_profile(data):

    school_object = School.objects.get(id=data['dbId'])

    school_object.name = data['name']
    school_object.printName = data['printName']
    school_object.diseCode = data['diseCode']
    school_object.address = data['address']
    school_object.registrationNumber = data['registrationNumber']

    school_object.currentSession = Session.objects.get(id=data['currentSessionDbId'])

    school_object.save()

    return get_school_profile_by_object(school_object)

