from common.common_views_3 import CommonView, CommonListView
from common.common_serializer_interface_3 import create_object
from decorators import user_permission, user_permission_3
from django.http import HttpResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

############## SMS Old ##############
from sms_app.models import SMS, SMSId, SMSTemplate, SMSEventSettings, SMSIdSchool
from .business.sms import get_sms_list


class SMSOldListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
            'startDateTime': request.GET['startDateTime'],
            'endDateTime': request.GET['endDateTime'],
        }
        return get_sms_list(data)


############## SMS Count ##############
from .business.sms_count import get_sms_count


class SMSCountView(APIView):

    @user_permission
    def get(request, school_id):
        return get_sms_count(school_id)



############## Msg Club Delivery Report ##############
from .business.msg_club_delivery_report import handle_msg_club_delivery_report, get_msg_club_delivery_report_list


class MsgClubDeliveryReportView(APIView):

    @user_permission
    def get(request):
        data = {
            'requestId': request.GET['requestId'],
        }
        return get_msg_club_delivery_report_list(data)


def handle_msg_club_delivery_report_view(request):
    data = json.loads(request.body.decode('utf-8'))
    handle_msg_club_delivery_report(data)
    return HttpResponse(status=201)


############## SMS Purchase ##############
from .business.sms_purchase import get_sms_purchase_list


class SMSPurchaseView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_sms_purchase_list(data)


############## SMS ##############
class SmsView(CommonView, APIView):
    Model = SMS
    RelationsToSchool = ['parentSchool__id']


class SmsListView(CommonListView, APIView):
    Model = SMS
    RelationsToSchool = ['parentSchool__id']


class SMSIdView(CommonView, APIView):
    Model = SMSId


class SMSIdListView(CommonListView, APIView):
    Model = SMSId


class SMSTemplateView(CommonView, APIView):
    Model = SMSTemplate


class SMSTemplateListView(CommonListView, APIView):
    Model = SMSTemplate


class SMSEventSettingsView(CommonView, APIView):
    Model = SMSEventSettings
    RelationsToSchool = ['parentSchool__id']


class SMSEventSettingsListView(CommonListView, APIView):
    Model = SMSEventSettings
    RelationsToSchool = ['parentSchool__id']


class SMSIdSchoolView(CommonView, APIView):
    Model = SMSIdSchool
    RelationsToSchool = ['parentSchool__id']


class SMSIdSchoolListView(CommonListView, APIView):
    Model = SMSIdSchool
    RelationsToSchool = ['parentSchool__id']