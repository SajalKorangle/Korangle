
import json

from common.common_views import CommonView, CommonListView, APIView
from common.common_serializer_interface import create_object

from decorators import user_permission_new
from fees_third_app.business.discount import create_discount_object, create_discount_list
from fees_third_app.business.stripe import create_stripe_account, get_client_ip


from fees_third_app.models import FeeType, SchoolFeeRule, ClassFilterFee, BusStopFilterFee, StudentFee, FeeReceipt, \
    SubFeeReceipt, Discount, SubDiscount, LockFee, OnlinePaymentAccount, ParentFeeTransaction


# Create your views here.


########### Fee Type #############


class FeeTypeView(CommonView, APIView):
    Model = FeeType


class FeeTypeListView(CommonListView, APIView):
    Model = FeeType


########### School Fee Rule #############


class SchoolFeeRuleView(CommonView, APIView):
    Model = SchoolFeeRule


class SchoolFeeRuleListView(CommonListView, APIView):
    Model = SchoolFeeRule


########### Class Filter Fee #############


class ClassFilterFeeView(CommonView, APIView):
    Model = ClassFilterFee


class ClassFilterFeeListView(CommonListView, APIView):
    Model = ClassFilterFee


########### Bus Stop Filter Fee #############


class BusStopFilterFeeView(CommonView, APIView):
    Model = BusStopFilterFee


class BusStopFilterFeeListView(CommonListView, APIView):
    Model = BusStopFilterFee


########### Student Fee #############


class StudentFeeView(CommonView, APIView):
    Model = StudentFee


class StudentFeeListView(CommonListView, APIView):
    Model = StudentFee


########### Fee Receipt #############
from .business.fee_receipt import create_fee_receipt_list, create_fee_receipt_object


class FeeReceiptView(CommonView, APIView):
    Model = FeeReceipt

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_fee_receipt_object(data, self.Model, self.ModelSerializer)


class FeeReceiptListView(CommonListView, APIView):
    Model = FeeReceipt

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_fee_receipt_list(data, self.Model, self.ModelSerializer)


########### Sub Fee Receipt #############


class SubFeeReceiptView(CommonView, APIView):
    Model = SubFeeReceipt


class SubFeeReceiptListView(CommonListView, APIView):
    Model = SubFeeReceipt


########### Discount #############


class DiscountView(CommonView, APIView):
    Model = Discount

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_discount_object(data, self.Model, self.ModelSerializer)


class DiscountListView(CommonListView, APIView):
    Model = Discount

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_discount_list(data, self.Model, self.ModelSerializer)


########### Sub Discount #############


class SubDiscountView(CommonView, APIView):
    Model = SubDiscount


class SubDiscountListView(CommonListView, APIView):
    Model = SubDiscount


########### Lock Fee #############


class LockFeeView(CommonView, APIView):
    Model = LockFee


class LockFeeListView(CommonListView, APIView):
    Model = LockFee



########### Online Payment Account #############


class OnlinePaymentAccountView(CommonView, APIView):
    Model = OnlinePaymentAccount

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        response =  create_stripe_account(data,get_client_ip(request))  
        if response['id']:
            data['stripeConnectId'] = response['id']
            return create_object(data, self.Model, self.ModelSerializer)
        else:
            return False
            


class OnlinePaymentAccountListView(CommonListView, APIView):
    Model = OnlinePaymentAccount


class OnlinePaymentAccountView(CommonView, APIView):
    Model = OnlinePaymentAccount

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        response =  create_stripe_account(data,get_client_ip(request))  
        if response['id']:
            data['stripeConnectId'] = response['id']
            return create_object(data, self.Model, self.ModelSerializer)
        else:
            return False
            


class ParentFeeTransactionListView(CommonListView, APIView):
    Model = ParentFeeTransaction

class ParentFeeTransactionView(CommonView, APIView):
    Model = ParentFeeTransaction

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        return create_payment_intent(data)