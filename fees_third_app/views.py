
import json

from common.common_views import CommonView, APIView, CommonListView, APIView, get_model_serializer
from decorators import user_permission_new

from fees_third_app.models import FeeType, SchoolFeeRule, ClassFilterFee, BusStopFilterFee, StudentFee, FeeReceipt, \
    SubFeeReceipt, Discount, SubDiscount, FeeFeature, LockFee


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


class DiscountListView(CommonListView, APIView):
    Model = Discount


########### Sub Discount #############


class SubDiscountView(CommonView, APIView):
    Model = SubDiscount


class SubDiscountListView(CommonListView, APIView):
    Model = SubDiscount


########### Fee Feature #############


class FeeFeatureView(CommonView, APIView):
    Model = FeeFeature


class FeeFeatureListView(CommonListView, APIView):
    Model = FeeFeature


########### Lock Fee #############


class LockFeeView(CommonView, APIView):
    Model = LockFee


class LockFeeListView(CommonListView, APIView):
    Model = LockFee


