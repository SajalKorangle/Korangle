from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from fees_third_app.cashfree.cashfree import getSettelmentsCycleList, ifscVerification, bankVerification
from common.common_serializer_interface_3 import create_object, get_object
from time import time

class SettelmentsCycleListView(APIView):

    @user_permission_3
    def get(self, request, *args, **kwargs):
        return getSettelmentsCycleList()   


class IFSCVerification(APIView):

    @user_permission_3
    def get(self, request, *args, **kwargs):
        return ifscVerification(**request.GET.dict())


class BankAccountVerification(APIView):

    @user_permission_3
    def post(self, request, *args, **kwargs):
        return bankVerification(**request.data)



########### Online Payment Account #############   
from fees_third_app.models import OnlinePaymentAccount
from fees_third_app.cashfree.cashfree import addVendor, getVendor, updateVendor

class OnlinePaymentAccountView(CommonView, APIView):
    Model = OnlinePaymentAccount
    RelationsToSchool=['parentSchool__id']
    permittedMethods= ['get', 'post', 'put']

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
        responseData =  get_object(request.GET, self.permittedQuerySet(**kwargs),  self.ModelSerializer)
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



########### Transaction #############
from fees_third_app.models import CashfreeTransaction
class CashfreeTransactionView(CommonView, APIView):
    Model = CashfreeTransaction
    RelationsToSchool = ['parentStudent__parentSchool__id'] 
    RelationsToStudent = ['parentStudent__id']
        
class CashfreeTransactionListView(CommonListView, APIView):
    Model = CashfreeTransaction
    RelationsToSchool = ['parentStudent__parentSchool__id'] 
    RelationsToStudent = ['parentStudent__id']


from fees_third_app.models import Order
from .cashfree import createAndSignCashfreeOrder

class OrderView(CommonView, APIView):
    Model = Order
    permittedMethods=['get', 'post',]
    RelationsToSchool=['parentSchool__id']

    @user_permission_3
    def post(self, request, *args, **kwargs):
        activeSchoolId = kwargs['activeSchoolID']
        schoolOnlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool = activeSchoolId)
        orderData = {
            'parentSchool': activeSchoolId,
            'orderId': str(int(time()*1000000)),
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignCashfreeOrder(request.data, createdOrderResponse['orderId'], schoolOnlinePaymentAccount.vendorId)
        print('createdOrderResponse: ', responseOrderData)
        return responseOrderData


from django.http import HttpResponseRedirect, HttpResponseForbidden, response
from .cashfree import getResponseSignature

class OrderCompletionView(APIView):
    permission_classes = []

    def post(self, request):
        print(request.POST)
        signatureFromData = getResponseSignature(request.POST)
        print('generated signature: ', signatureFromData)
        if(not signatureFromData.decode('utf-8') == request.POST['signature']):
            return HttpResponseForbidden()

        orderInstance = Order.objects.get(orderId=request.POST['orderId'])
        if(request.POST['txStatus'] == 'SUCCESS'):
            orderInstance.status = 'Completed'
            orderInstance.save()

        redirectUrl = request.GET['redirect_to'] + '&orderId={0}'.format(request.POST['orderId']) # Appending orderId to the redirect url
        print('rdeirectUrl = ', redirectUrl)
        return HttpResponseRedirect(redirectUrl)
