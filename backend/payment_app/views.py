from .cashfree.cashfree import getResponseSignature
from django.http import HttpResponseRedirect, HttpResponseForbidden
from .cashfree.cashfree import createAndSignCashfreeOrderForKorangle
from .cashfree.cashfree import createAndSignCashfreeOrderForSchool
from .models import Order
from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import create_object, get_object
from decorators import user_permission_3
from django.db import transaction
from time import time


########### Online Payment Account #############
from .models import OnlinePaymentAccount
from .cashfree.cashfree import addVendor, getVendor, updateVendor


class OnlinePaymentAccountView(CommonView, APIView):
    Model = OnlinePaymentAccount
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get', 'post', 'put']

    @user_permission_3
    def post(self, request, *args, **kwargs):
        data = request.data
        vendorId = str(int(time()*1000000))
        vendorData = data['vendorData']

        addVendor(vendorData, vendorId)

        del data['vendorData']
        data.update({"vendorId": vendorId})
        responseData = create_object(data, self.ModelSerializer, *args, **kwargs)
        responseData.update({
            'vendorData': getVendor(vendorId)
        })
        return responseData

    @user_permission_3
    def get(self, request, *args, **kwargs):
        responseData = get_object(request.GET, self.permittedQuerySet(**kwargs),  self.ModelSerializer)
        if(responseData):
            responseData.update({
                'vendorData': getVendor(responseData['vendorId'])
            })
        return responseData

    @user_permission_3
    def put(self, request, *args, **kwargs):
        data = request.data
        vendorData = data['vendorData']
        updateVendor(vendorData)
        data.update({
            'vendorData': getVendor(data['vendorId'])
        })
        return data


# 1. Should the order id be created from here or from pre save signal of FeeReceiptOrder
# @answer : Order and order id is a generic thing. Why would we create order id from pre save signal of FeeReceiptOrder? Reason
# It is will also not be feasible to do so as there will be no way of knowing if a order is for fee payment or sms payment until the connecting models are created i.e, OnlineFeePaymentTransaction
## Currently used only for online fee payment ##
class OrderSchoolView(CommonView, APIView):
    Model = Order
    permittedMethods = ['get', 'post', ]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        activeSchoolId = kwargs['activeSchoolID']
        schoolOnlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool=activeSchoolId)
        orderData = {
            'orderId': str(int(time()*1000000)),
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignCashfreeOrderForSchool(request.data, createdOrderResponse['orderId'], schoolOnlinePaymentAccount.vendorId)
        return responseOrderData


# 1. Should the order id be created from here or from pre save signal of SchoolSMSPurchaseOrder
# @answer : Same as previous answer.
## Currently used only for sms purchase ##
class OrderSelfView(CommonView, APIView):
    Model = Order
    permittedMethods = ['get', 'post', ]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        orderData = {
            'orderId': str(int(time()*1000000)),
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignCashfreeOrderForKorangle(request.data, createdOrderResponse['orderId'])
        return responseOrderData


class OrderListView(CommonListView, APIView):
    Model = Order
    permittedMethods = ['get']


## This is a cashfree webhook which is called from cashfree after payment completion or failure##
class OrderCompletionView(APIView):
    permission_classes = []

    def post(self, request):
        signatureFromData = getResponseSignature(request.POST)
        if(not signatureFromData.decode('utf-8') == request.POST['signature']):
            return HttpResponseForbidden()

        orderInstance = Order.objects.get(orderId=request.POST['orderId'])
        if(request.POST['txStatus'] == 'SUCCESS'):
            orderInstance.status = 'Completed'
            orderInstance.referenceId = request.POST['referenceId']
            try:
                # On save django pre save signals will be fired.
                # It will try to use the received amount to create fee receipt or purchase sms.
                # In case of failure we will refund the amount.
                with transaction.atomic():
                    orderInstance.save()
            except:
                # Order Save has failed with status as Completed, so we will refund the amount.
                with transaction.atomic():
                    orderInstance.status = 'Refund Pending'
                    orderInstance.save()

        # Redirect to the redirect to params with orderId as extra params
        redirectUrl = request.GET['redirect_to'] + '&orderId={0}'.format(orderInstance.orderId)
        return HttpResponseRedirect(redirectUrl)
