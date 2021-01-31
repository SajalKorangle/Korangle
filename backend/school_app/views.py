
from decorators import user_permission

from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

from common.common_functions import get_error_response, get_success_message, get_success_response

################ School Profile ############
from .handlers.school_profile import update_school_profile
from .business.school_profile import create_school_profile


class SchoolProfileView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_school_profile(data)

    def put(self, request, school_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(update_school_profile(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


################ Bus Stops ##################
from .handlers.bus_stops import get_bus_stops
@api_view(['GET'])
def get_bus_stops_view(request, school_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        return JsonResponse({'response': get_success_response(get_bus_stops(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Working Days ##################
from .handlers.working_days import get_working_days, create_working_days, update_working_days
@api_view(['GET'])
def get_working_days_view(request, school_id, session_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(get_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def create_working_days_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(create_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['PUT'])
def update_working_days_view(request, school_session_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['schoolSessionDbId'] = school_session_id
        return JsonResponse({'response': get_success_message(update_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############ Profile Image ########################
from .business.profile_image import update_profile_image


class ProfileImageView(APIView):

    @user_permission
    def post(request, school_id):
        return update_profile_image(request.FILES['myFile'], school_id)


############ Principal Signature Image ########################
from .business.principal_signature_image import update_principal_signature_image


class PrincipalSignatureImageView(APIView):

    @user_permission
    def post(request, school_id):
        return update_principal_signature_image(request.FILES['myFile'], school_id)

from common.common_views_3 import CommonView, CommonListView
from .model.models import BusStop

class BusStopView(CommonView, APIView):
    Model = BusStop
    RelationsToSchool = ['parentSchool__id']


class BusStopListView(CommonListView, APIView):
    Model = BusStop
    RelationsToSchool = ['parentSchool__id']



from .model.models import SchoolSummary

class SchoolSummaryView(CommonView, APIView):  # testing code
    permittedMethods=['get']
    Model = SchoolSummary

class SchoolSummaryListView(CommonListView, APIView):  # testing code
    permittedMethods=['get']
    Model = SchoolSummary