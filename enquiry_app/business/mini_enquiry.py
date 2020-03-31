
from enquiry_app.models import Enquiry


def get_mini_enquriry_list(data):

    enquiry_list = []

    for enquiry_object in Enquiry.objects.filter(parentSchool_id=data['parentSchool'])\
            .order_by('studentName').select_related('parentClass'):
        tempEnquiry = {
            'id': enquiry_object.id,
            'enquirerName': enquiry_object.enquirerName,
            'dateOfEnquiry': enquiry_object.dateOfEnquiry,
            'studentName':enquiry_object.studentName
        }
        enquiry_list.append(tempEnquiry)

    return enquiry_list
