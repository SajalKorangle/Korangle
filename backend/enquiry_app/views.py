from decorators import user_permission
from common.common_views_3 import CommonView, CommonListView

from rest_framework.views import APIView

import json


############## Enquiry ##############
from .business.enquiry \
    import get_enquiry, create_enquiry, delete_enquiry, update_enquiry, get_enquiry_list


class EnquiryProfileView(APIView):

    @user_permission
    def get(request, enquiry_id):
        data = {
            'id': enquiry_id,
        }
        return get_enquiry(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_enquiry(data)

    @user_permission
    def put(request, enquiry_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_enquiry(data)

    @user_permission
    def delete(request, enquiry_id):
        data = {
            'id': enquiry_id,
        }
        return delete_enquiry(data)


class EnquiryListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
            'startDate': request.GET['startDate'],
            'endDate': request.GET['endDate'],
        }
        return get_enquiry_list(data)


############## Mini Enquiry ##############
from .business.mini_enquiry import get_mini_enquriry_list


class MiniEnquiryView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_mini_enquriry_list(data)

from .models import Enquiry

class EnquiryyView(CommonView,APIView):
    Model = Enquiry
    RelationsToSchool = ['parentSchool', 'parentEmployee__parentSchool']

class EnquiryyListView(CommonListView,APIView):
    Model = Enquiry
    RelationsToSchool = ['parentSchool', 'parentEmployee__parentSchool']