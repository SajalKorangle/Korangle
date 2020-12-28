from common.common_views import CommonView, CommonListView
from common.common_serializer_interface import create_object, update_object
from decorators import user_permission, user_permission_new
from django.http import HttpResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

import razorpay
import hmac
import hashlib


razpay_key = 'rzp_test_9ItYu1Pd8xL43N'
razpay_secret = 'XfIG2E05lIuJZE2adjRPTmHL'


def hmac_sha256(val):
    h = hmac.new(razpay_secret.encode("ASCII"), val.encode("ASCII"), digestmod=hashlib.sha256).hexdigest()
    print(h)
    return h


def create_rzpay_order(reqData):
    rzpay = razorpay.Client(auth=(razpay_key, razpay_secret))
    rzpay.set_app_details({"title" : "<Korangle>", "version" : "<1>"})
    rzData = {}
    rzData['amount'] = reqData['price']*100
    rzData['currency'] = 'INR'
    rzData['receipt'] = str(reqData['id'])
    rzData['payment_capture'] = 0
    rzresp = rzpay.order.create(data=rzData)  # Calling razorpay api to create order
    print(rzresp)
    return rzresp

def verify_txn(reqData):
    rzpay = razorpay.Client(auth=(razpay_key, razpay_secret))
    rzpay.set_app_details({"title" : "<Korangle>", "version" : "<1>"})
    generated_signature = hmac_sha256(reqData["razorpay_order_id"] + "|" + reqData["razorpay_payment_id"])
    if (generated_signature == reqData["razorpay_signature"]):
        res = rzpay.payment.capture(reqData["razorpay_payment_id"], reqData["amount"], {"currency":"INR"})
        return True
    else:
        return False
    

############## SMS Old ##############
from sms_app.models import SMS, SMSPurchase
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


class SMSPurchaseView(CommonView, APIView):
    Model = SMSPurchase
    
    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_sms_purchase_list(data)

    @user_permission_new
    def post(self, request):
        # create a record in database of this requested data

        data = json.loads(request.body.decode('utf-8'))
        response =  create_object(data, self.Model, self.ModelSerializer)
        print('created')
        print(response)
        
        # call razor pay to create order-id

        rzresponse = create_rzpay_order(response)

        # update that record with order-id and send order id to front-end

        update_data = {}
        update_data['price'] = rzresponse['amount']/100
        update_data['id'] = int('0' + rzresponse['receipt'])
        update_data['orderId'] = rzresponse['id']
        update_response = update_object(update_data, self.Model, self.ModelSerializer)
        print('updated')
        print(update_response)
        return update_response

    @user_permission_new
    def put(self, request):
        print('request to match the signature')
        print(request.body)
        reqData = json.loads(request.body.decode('utf-8'))
        reqData['response']['amount'] = reqData['amount']*100
        # verify the transaction and update the capture_payment attribute of record with respective order-id and send response to front-end

        if (verify_txn(reqData['response'])):
            print('signature matched')
            update_data = {}
            update_data['id'] = reqData['id']
            update_data['payment_capture']=1
            update_response = update_object(update_data,self.Model, self.ModelSerializer)
            print(update_response)
            return update_response
        else:
            response = 'Signature dont matched, update failed'
            return response
            





############## SMS ##############
from .business.send_sms import send_sms, send_different_sms


class SmsView(CommonView, APIView):
    Model = SMS

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
