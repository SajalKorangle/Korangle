
import json

from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_new
from fees_third_app.business.discount import create_discount_object, create_discount_list

from fees_third_app.models import FeeType, SchoolFeeRule, ClassFilterFee, BusStopFilterFee, StudentFee, FeeReceipt, \
    SubFeeReceipt, Discount, SubDiscount, LockFee

from student_app.models import Student
# Create your views here.


########### Fee Type #############


class FeeTypeView(CommonView, APIView):
    Model = FeeType
    RelationsToSchool = ['parentSchool']


class FeeTypeListView(CommonListView, APIView):
    Model = FeeType
    RelationsToSchool = ['parentSchool']


########### School Fee Rule #############


class SchoolFeeRuleView(CommonView, APIView):
    Model = SchoolFeeRule
    RelationsToSchool = ['parentFeeType__parentSchool']


class SchoolFeeRuleListView(CommonListView, APIView):
    Model = SchoolFeeRule
    RelationsToSchool = ['parentFeeType__parentSchool']


########### Class Filter Fee #############


class ClassFilterFeeView(CommonView, APIView):
    Model = ClassFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool']


class ClassFilterFeeListView(CommonListView, APIView):
    Model = ClassFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool']


########### Bus Stop Filter Fee #############


class BusStopFilterFeeView(CommonView, APIView):
    Model = BusStopFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool']


class BusStopFilterFeeListView(CommonListView, APIView):
    Model = BusStopFilterFee
    RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool']


########### Student Fee #############


class StudentFeeView(CommonView, APIView):
    Model = StudentFee
    RelationsToSchool = ['parentFeeType__parentSchool', 'parentStudent__parentSchool', 'parentSchoolFeeRule__parentFeeType__parentSchool']
    RelationsToStudent = ['parentStudent']


class StudentFeeListView(CommonListView, APIView):
    Model = StudentFee
    RelationsToSchool = ['parentFeeType__parentSchool', 'parentStudent__parentSchool', 'parentSchoolFeeRule__parentFeeType__parentSchool']
    RelationsToStudent = ['parentStudent']


########### Fee Receipt #############
from .business.fee_receipt import create_fee_receipt_list, create_fee_receipt_object


class FeeReceiptView(CommonView, APIView):
    Model = FeeReceipt
    RelationsToSchool = ['parentSchool', 'parentStudent__parentSchool', 'parentEmployee__parentSchool']
    RelationsToStudent = ['parentStudent']

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_fee_receipt_object(data, self.Model, self.ModelSerializer)


class FeeReceiptListView(CommonListView, APIView):
    Model = FeeReceipt
    RelationsToSchool = ['parentSchool', 'parentStudent__parentSchool', 'parentEmployee__parentSchool']
    RelationsToStudent = ['parentStudent']

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_fee_receipt_list(data, self.Model, self.ModelSerializer)


########### Sub Fee Receipt #############


class SubFeeReceiptView(CommonView, APIView):
    Model = SubFeeReceipt
    RelationsToSchool = ['parentFeeReceipt__parentSchool', 'parentStudentFee__parentStudent__parentSchool', 'parentFeeType__parentSchool']
    RelationsToStudent = ['parentStudentFee__parentStudent', 'parentFeeReceipt__parentStudent']


class SubFeeReceiptListView(CommonListView, APIView):
    Model = SubFeeReceipt
    RelationsToSchool = ['parentFeeReceipt__parentSchool', 'parentStudentFee__parentStudent__parentSchool', 'parentFeeType__parentSchool']
    RelationsToStudent = ['parentStudentFee__parentStudent', 'parentFeeReceipt__parentStudent']


########### Discount #############


class DiscountView(CommonView, APIView):
    Model = Discount
    RelationsToSchool = ['parentSchool', 'parentEmployee__parentSchool', 'parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_discount_object(data, self.Model, self.ModelSerializer)


class DiscountListView(CommonListView, APIView):
    Model = Discount
    RelationsToSchool = ['parentSchool', 'parentEmployee__parentSchool', 'parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_discount_list(data, self.Model, self.ModelSerializer)


########### Sub Discount #############


class SubDiscountView(CommonView, APIView):
    Model = SubDiscount
    RelationsToSchool = ['parentDiscount__parentSchool', 'parentStudentFee__parentStudent__parentSchool']
    RelationsToStudent = ['parentDiscount__parentStudent']


class SubDiscountListView(CommonListView, APIView):
    Model = SubDiscount
    RelationsToSchool = ['parentDiscount__parentSchool', 'parentStudentFee__parentStudent__parentSchool']
    RelationsToStudent = ['parentStudentFee__parentStudent']


########### Lock Fee #############


class LockFeeView(CommonView, APIView):
    Model = LockFee
    RelationsToSchool = ['parentSchool']


class LockFeeListView(CommonListView, APIView):
    Model = LockFee
    RelationsToSchool = ['parentSchool']


