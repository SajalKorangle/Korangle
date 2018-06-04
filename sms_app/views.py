from decorators import user_permission
from django.http import HttpResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json


############## SMS ##############
from .business.sms import get_sms_list


class SMSListView(APIView):

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
        data = {
            'parentSchool': school_id,
        }
        return get_sms_count(data)


############## Send SMS ##############
from .business.send_sms import send_sms


class SendSMSView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return send_sms(data)


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
