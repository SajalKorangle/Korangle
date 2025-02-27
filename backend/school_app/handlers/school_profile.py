
from school_app.model.models import School, Session


def get_school_profile_by_object(school_object):

    school_profile_response = {}

    school_profile_response['dbId'] = school_object.id
    school_profile_response['name'] = school_object.name
    school_profile_response['printName'] = school_object.printName
    school_profile_response['diseCode'] = school_object.diseCode
    school_profile_response['address'] = school_object.address
    school_profile_response['opacity'] = school_object.opacity
    school_profile_response['registrationNumber'] = school_object.registrationNumber
    school_profile_response['affiliationNumber'] = school_object.affiliationNumber
    school_profile_response['medium'] = school_object.medium
    school_profile_response['currentSessionDbId'] = school_object.currentSession.id
    school_profile_response['mobileNumber'] = school_object.mobileNumber

    school_profile_response['pincode'] = school_object.pincode
    school_profile_response['villageCity'] = school_object.villageCity
    school_profile_response['block'] = school_object.block
    school_profile_response['district'] = school_object.district
    school_profile_response['state'] = school_object.state

    return school_profile_response


def update_school_profile(data):

    school_object = School.objects.get(id=data['dbId'])

    school_object.name = data['name']
    school_object.printName = data['printName']
    school_object.diseCode = data['diseCode']
    school_object.address = data['address']
    school_object.opacity = data['opacity']
    school_object.registrationNumber = data['registrationNumber']
    school_object.affiliationNumber = data['affiliationNumber']
    school_object.medium = data['medium']
    school_object.mobileNumber = data['mobileNumber']

    school_object.pincode = data['pincode']
    school_object.villageCity = data['villageCity']
    school_object.block = data['block']
    school_object.district = data['district']
    school_object.state = data['state']

    school_object.currentSession = Session.objects.get(id=data['currentSessionDbId'])

    school_object.save()

    return get_school_profile_by_object(school_object)

