from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from fees_third_app.cashfree.cashfree import getSettelmentsCycleList, ifscVerification, bankVerification
from common.common_serializer_interface_3 import create_object, get_object
from django.db.models import Max

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
        maxId = OnlinePaymentAccount.objects.all().aggregate(Max('id'))['id__max'] or 4
        vendorId = str(maxId +1)
        vendorData = data['vendorData']
        print(vendorData)
        addVendor(vendorData, vendorId) 

        del data['vendorData']
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
                'vendorData': getVendor(responseData['id'])
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

# class OrderView(CommonView, APIView):
#     Model = Order
#     permittedMethods=['get', 'post',]

#     @user_permission_3
#     def post(self, request, *args, **kwargs):
#         activeSchoolId = kwargs['activeSchoolID']
#         schoolOnlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool = activeSchoolId)
#         orderData = {
#             'amount': request.data['orderAmount']
#         }

#         createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

#         newCashfreeOrder = createCashfreeOrder(request.data, createdOrderResponse['id'], schoolOnlinePaymentAccount.vendorId)
#         createdOrderResponse.update({
#             'paymentLink': newCashfreeOrder['paymentLink']
#         })
#         return createdOrderResponse

from .cashfree import createAndSignCashfreeOrder
class OrderView(CommonView, APIView):
    Model = Order
    permittedMethods=['get', 'post',]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        activeSchoolId = kwargs['activeSchoolID']
        schoolOnlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool = activeSchoolId)
        orderData = {
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignCashfreeOrder(request.data, createdOrderResponse['id'], schoolOnlinePaymentAccount.id)
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

        orderInstance = Order.objects.get(id=request.POST['orderId'])
        if(request.POST['txStatus'] == 'SUCCESS'):
            orderInstance.status = 'Completed'
            orderInstance.save()

        redirectUrl = request.GET['redirect_to'] + '&orderId={0}'.format(request.POST['orderId'])
        print('rdeirectUrl = ', redirectUrl)
        return HttpResponseRedirect(redirectUrl) # Appending orderId to the redirect url
