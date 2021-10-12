from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from fees_third_app.business.discount import create_discount_object, create_discount_list

from fees_third_app.models import FeeType, SchoolFeeRule, ClassFilterFee, BusStopFilterFee, StudentFee, FeeReceipt, \
    SubFeeReceipt, Discount, SubDiscount


# Create your views here.


########### Fee Type #############


class FeeTypeView(CommonView, APIView):
    Model = FeeType
    RelationsToSchool = ['parentSchool__id']


class FeeTypeListView(CommonListView, APIView):
    Model = FeeType
    RelationsToSchool = ['parentSchool__id']


########### School Fee Rule #############


class SchoolFeeRuleView(CommonView, APIView):
    Model = SchoolFeeRule
    RelationsToSchool = ['parentFeeType__parentSchool__id']


class SchoolFeeRuleListView(CommonListView, APIView):
    Model = SchoolFeeRule
    RelationsToSchool = ['parentFeeType__parentSchool__id']


########### Class Filter Fee #############


class ClassFilterFeeView(CommonView, APIView):
    Model = ClassFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']


class ClassFilterFeeListView(CommonListView, APIView):
    Model = ClassFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']


########### Bus Stop Filter Fee #############


class BusStopFilterFeeView(CommonView, APIView):
    Model = BusStopFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']


class BusStopFilterFeeListView(CommonListView, APIView):
    Model = BusStopFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']


########### Student Fee #############


class StudentFeeView(CommonView, APIView):
    Model = StudentFee
    RelationsToSchool = ['parentFeeType__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSchoolFeeRule__parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentFeeListView(CommonListView, APIView):
    Model = StudentFee
    RelationsToSchool = ['parentFeeType__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSchoolFeeRule__parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Fee Receipt #############
class FeeReceiptView(CommonView, APIView):
    Model = FeeReceipt
    RelationsToSchool = ['parentSchool__id', 'parentStudent__parentSchool__id', 'parentEmployee__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class FeeReceiptListView(CommonListView, APIView):
    Model = FeeReceipt
    RelationsToSchool = ['parentSchool__id', 'parentStudent__parentSchool__id', 'parentEmployee__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Sub Fee Receipt #############
class SubFeeReceiptView(CommonView, APIView):
    Model = SubFeeReceipt
    RelationsToSchool = ['parentFeeReceipt__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentStudentFee__parentStudent__id', 'parentFeeReceipt__parentStudent__id']


class SubFeeReceiptListView(CommonListView, APIView):
    Model = SubFeeReceipt
    RelationsToSchool = ['parentFeeReceipt__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentStudentFee__parentStudent__id', 'parentFeeReceipt__parentStudent__id']


########### Discount #############


class DiscountView(CommonView, APIView):
    Model = Discount
    RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

    @user_permission_3
    def post(self, request, activeSchoolID, activeStudentID):
        data = request.data
        return create_discount_object(data, self.Model, self.ModelSerializer, activeSchoolID, activeStudentID)


class DiscountListView(CommonListView, APIView):
    Model = Discount
    RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

    @user_permission_3
    def post(self, request, activeSchoolID, activeStudentID):
        data = request.data
        return create_discount_list(data, self.Model, self.ModelSerializer, activeSchoolID, activeStudentID)


########### Sub Discount #############


class SubDiscountView(CommonView, APIView):
    Model = SubDiscount
    RelationsToSchool = ['parentDiscount__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentDiscount__parentStudent__id', 'parentStudentFee__parentStudent__id']


class SubDiscountListView(CommonListView, APIView):
    Model = SubDiscount
    RelationsToSchool = ['parentDiscount__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
    RelationsToStudent = ['parentDiscount__parentStudent__id', 'parentStudentFee__parentStudent__id']


########### Fee Settings #############
from .models import FeeSettings


class FeeSettingsView(CommonView, APIView):
    Model = FeeSettings
    RelationsToSchool = ['parentSchool__id']


class FeeSettingsListView(CommonListView, APIView):
    Model = FeeSettings
    RelationsToSchool = ['parentSchool__id']


########### FeeReceiptOrder #############
from fees_third_app.models import FeeReceiptOrder


class FeeReceiptOrderView(CommonView, APIView):
    Model = FeeReceiptOrder
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']


class FeeReceiptOrderListView(CommonListView, APIView):
    Model = FeeReceiptOrder
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']
