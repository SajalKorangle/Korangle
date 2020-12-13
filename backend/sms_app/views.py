from common.common_views_3 import CommonView, CommonListView
from common.common_serializer_interface import create_object
from decorators import user_permission, user_permission_new
from django.http import HttpResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json


############## SMS Old ##############
from sms_app.models import SMS
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
        data = {
            'parentSchool': school_id,
        }
        return get_sms_count(data)


############## Send SMS Old ##############
from .business.send_sms import send_sms_old


class SendSMSView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return send_sms_old(data)


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
from .business.send_sms import send_sms, send_different_sms


class SmsView(CommonView, APIView):
    Model = SMS
    RelationsToSchool= ['parentSchool']

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return_data = { 'status': 'success' }
        if data['mobileNumberList'] != '':
            return_data = send_sms(data)
            print(data)
            if return_data['status'] == 'success':
                data['requestId'] = return_data['requestId']
                return_data['data'] = create_object(data, self.Model, self.ModelSerializer)
        else:
            data['requestId'] = 1
            return_data['data'] = create_object(data, self.Model, self.ModelSerializer)
        return return_data


## Mobile number list and count still needed

class SmsDifferentView(CommonView, APIView):
    Model = SMS
    RelationsToSchool= ['parentSchool']

    @user_permission_new
    def post(self, request):
        # print(request.body)
        data = json.loads(request.body)
        # data = json.loads(request.body.decode('utf-8'))
        return_data = {'status': 'success'}
        if len(data["data"]) > 0:
            return_data = send_different_sms(data)
            if return_data["status"] == 'success':
                data['requestId'] = return_data['requestId']
                return_data["data"] = create_object(data, self.Model, self.ModelSerializer)
        else:
            return_data["data"] = create_object(data, self.Model, self.ModelSerializer)
            print(return_data)
        return return_data



class SmsListView(CommonListView, APIView):
    Model = SMS
    RelationsToSchool= ['parentSchool']
