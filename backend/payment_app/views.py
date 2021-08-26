from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import create_object, get_object
from decorators import user_permission_3
from time import time

# Create your views here.
########### Online Payment Account #############   
from .models import OnlinePaymentAccount
from .cashfree.cashfree import addVendor, getVendor, updateVendor

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



from .models import Order
from .cashfree.cashfree import createAndSignCashfreeOrder

class OrderSchoolView(CommonView, APIView):
    Model = Order
    permittedMethods=['get', 'post',]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        activeSchoolId = kwargs['activeSchoolID']
        schoolOnlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool = activeSchoolId)
        orderData = {
            'orderId': str(int(time()*1000000)),
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignCashfreeOrder(request.data, createdOrderResponse['orderId'], schoolOnlinePaymentAccount.vendorId)
        return responseOrderData


from .cashfree.cashfree import createAndSignSelfCashfreeOrder
class OrderSelfView(CommonView, APIView):
    Model = Order
    permittedMethods=['get', 'post',]

    @user_permission_3
    def post(self, request, *args, **kwargs):
        orderData = {
            'orderId': str(int(time()*1000000)),
            'amount': request.data['orderAmount']
        }

        createdOrderResponse = create_object(orderData, self.ModelSerializer, **kwargs)

        responseOrderData = createAndSignSelfCashfreeOrder(request.data, createdOrderResponse['orderId'])
        return responseOrderData

class OrderListView(CommonListView, APIView):
    Model = Order
    permittedMethods=['get']


from django.http import HttpResponseRedirect, HttpResponseForbidden
from .cashfree.cashfree import getResponseSignature

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
            # Code Review
            # Write a comment why the first orderInstance.save() is different than the other one.
            try:
                orderInstance.save()
            except:
                orderInstance.status = 'Refund Pending'
                orderInstance.save()

        redirectUrl = request.GET['redirect_to'] +'&orderId={0}'.format(orderInstance.orderId)
        return HttpResponseRedirect(redirectUrl)
