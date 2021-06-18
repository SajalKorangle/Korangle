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
        addVendor(vendorData, vendorId) 

        del data['vendorData']
        data.update({
            'vendorId': vendorId
        })
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
from fees_third_app.models import Transaction
class TransactionListView(CommonListView, APIView):
    Model = Transaction

class TransactionView(CommonView, APIView):
    Model = Transaction

        