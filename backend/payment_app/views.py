from .cashfree.cashfree import getResponseSignature
from .cashfree.cashfree import createAndSignCashfreeOrderForKorangle
from .cashfree.cashfree import createAndSignCashfreeOrderForSchool
from .models import Order
from .easebuzz_lib.helpersForKorangle import createOrder, verifyPayment

from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import get_object
from generic.generic_serializer_interface import GenericSerializerInterface
from decorators import user_permission_3

from django.http import HttpResponseRedirect, HttpResponseForbidden
from django.urls import reverse
from django.db import transaction
from time import time


########### Online Payment Account #############
from .models import SchoolMerchantAccount
from .cashfree.cashfree import addVendor, getVendor, updateVendor


class SchoolMerchantAccountView(CommonView, APIView):
    Model = SchoolMerchantAccount
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get', 'post', 'put']

    @user_permission_3
    def post(self, request, *args, **kwargs):
        data = request.data
        vendorId = str(int(time() * 1000000))
        vendorData = data['vendorData']

        addVendor(vendorData, vendorId)

        del data['vendorData']
        data.update({"vendorId": vendorId})
        responseData = GenericSerializerInterface(
            Model=self.Model, data=data, activeSchoolId=kwargs['activeSchoolID'], activeStudentIdList=kwargs['activeSchoolID']).create_object()
        responseData.update({
            'vendorData': getVendor(vendorId)
        })
        return responseData

    @user_permission_3
    def get(self, request, *args, **kwargs):
        responseData = get_object(request.GET, self.permittedQuerySet(**kwargs), self.ModelSerializer)
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


class OrderSchoolView(CommonView, APIView):
    Model = Order
    permittedMethods = ['get', 'post', ]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        activeSchoolId = kwargs['activeSchoolID']
        schoolOnlinePaymentAccount = SchoolMerchantAccount.objects.get(parentSchool=activeSchoolId)
        assert schoolOnlinePaymentAccount.isEnabled, "Online Payment is not enabled for this school"
        orderData = {
            'orderId': str(int(time() * 1000000)),
            'parentUser': request.user.id,
            'amount': request.data['orderAmount']
        }
        for child_field in [key for key in request.data if key in self.Model._meta.fields_map]:
            orderData[child_field] = request.data[child_field]
            del request.data[child_field]

        cashfreeOrderData = request.data
        cashfreeOrderData['returnUrl'] = request.data['returnData']['origin'] + \
            reverse('cashfree_order_completion') + '?' + request.data['returnData']['searchParams']
        del cashfreeOrderData['returnData']

        createdOrderResponse = GenericSerializerInterface(
            Model=self.Model, data=orderData, activeSchoolId=kwargs['activeSchoolID'], activeStudentIdList=kwargs['activeStudentID']).create_object()

        responseOrderData = createAndSignCashfreeOrderForSchool(cashfreeOrderData, createdOrderResponse['orderId'], schoolOnlinePaymentAccount.vendorId, schoolOnlinePaymentAccount.percentageOfPlatformFeeOnSchool)
        return responseOrderData


class OrderSelfView(CommonView, APIView):
    Model = Order
    permittedMethods = ['get', 'post', ]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        orderData = {
            'orderId': str(int(time() * 1000000)),
            'parentUser': request.user.id,
            'amount': request.data['orderAmount']
        }
        for child_field in [key for key in request.data if key in self.Model._meta.fields_map]:
            orderData[child_field] = request.data[child_field]
            del request.data[child_field]

        cashfreeOrderData = request.data
        cashfreeOrderData['returnUrl'] = request.data['returnData']['origin'] + \
            reverse('cashfree_order_completion') + '?' + request.data['returnData']['searchParams']
        del cashfreeOrderData['returnData']

        createdOrderResponse = GenericSerializerInterface(
            Model=self.Model, data=orderData, activeSchoolId=kwargs['activeSchoolID'], activeStudentIdList=kwargs['activeStudentID']).create_object()
        responseOrderData = createAndSignCashfreeOrderForKorangle(cashfreeOrderData, createdOrderResponse['orderId'])
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


class EaseBuzzOrderSelfView(CommonView, APIView):
    Model = Order
    permittedMethods = ['get', 'post', ]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        order = self.createOrder(request.data, request.user, kwargs)
        return order

    def createOrder(self, data, user, kwargs):
        orderData = {
            'orderId': str(int(time() * 1000000)),
            'parentUser': user.id,
            'amount': data['orderAmount']
        }
        for child_field in [key for key in data if key in self.Model._meta.fields_map]:
            orderData[child_field] = data[child_field]
            del data[child_field]
        
        easebuzz_order = createOrder(data, orderData["orderId"])

        if(easebuzz_order.get("success", False)!=False):
            GenericSerializerInterface(
                Model=self.Model, data=orderData, activeSchoolId=kwargs['activeSchoolID'], activeStudentIdList=kwargs['activeStudentID']).create_object()
        
        return easebuzz_order


class EaseBuzzOrderCompletionView(APIView):
    permission_classes = []
    def post(self, request):
        final_response = verifyPayment(request)
        # Status 0 if hashes dont match
        if final_response["status"] == 0:
            return HttpResponseForbidden()

        orderInstance = Order.objects.get(orderId=request.POST["txnid"])
        if request.POST["status"] == "success":
            orderInstance.status = "Completed"
            orderInstance.referenceId = request.POST["easepayid"]
            try:
                # On save django pre save signals will be fired.
                # It will try to use the received amount to create fee receipt or purchase sms.
                # In case of failure we will refund the amount.
                with transaction.atomic():
                    orderInstance.save()
            except:
                # Order Save has failed with status as Completed, so we will refund the amount.
                with transaction.atomic():
                    orderInstance.status = "Refund Pending"
                    orderInstance.save()

        # Redirect to the params with orderId as extra params
        redirectUrl = request.GET["redirect_to"] + "&orderId={0}".format(
            orderInstance.orderId
        )
        return HttpResponseRedirect(redirectUrl)
