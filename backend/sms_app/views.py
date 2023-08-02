from .business.sms_purchase import get_sms_purchase_list
from common.common_views_3 import CommonView, CommonListView, common_json_view_function
from decorators import user_permission, user_permission_3
from django.http import HttpResponse

from rest_framework.views import APIView


############## SMS Old ##############
from sms_app.models import SMS, SMSId, SMSTemplate, SMSEventSettings, SMSIdSchool, SMSPurchase
from .business.sms import get_sms_list


class SMSOldListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
            'startDateTime': request.GET['startDateTime'],
            'endDateTime': request.GET['endDateTime'],
        }
        return get_sms_list(data)


from .business.sms_delivery_report import handle_sms_delivery_report, handle_msg_club_delivery_report


def handle_sms_delivery_report_view(request):
    data_from_vendor = request.body.decode('utf-8')
    handle_sms_delivery_report(data_from_vendor)
    return HttpResponse(status=201)


def handle_msg_club_delivery_report_view(request):
    data = json.loads(request.body.decode('utf-8'))
    handle_msg_club_delivery_report(data)
    return HttpResponse(status=201)


############## SMS Count ##############
from .business.sms_count import get_sms_count


class SMSCountView(APIView):

    @user_permission
    def get(request, school_id):
        return get_sms_count(school_id)


############## SMS Delivery Report ##############
from .business.sms_delivery_report import get_sms_delivery_report_list


class SMSDeliveryReportView(CommonView, APIView):

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        return get_sms_delivery_report_list(request.GET)


# class MsgClubDeliveryReportView(APIView):
#
#     @user_permission
#     def get(request):
#         data = {
#             'requestId': request.GET['requestId'],
#         }
#         return get_msg_club_delivery_report_list(data)
#
#
# def handle_msg_club_delivery_report_view(request):
#     data = json.loads(request.body.decode('utf-8'))
#     handle_msg_club_delivery_report(data)
#     return HttpResponse(status=201)

############## SMS Purchase ##############


class SMSPurchaseOldView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_sms_purchase_list(data)


############## SMS ##############
class SmsView(CommonView, APIView):
    Model = SMS
    RelationsToSchool = ['parentSchool__id']


class SmsListView(CommonListView, APIView):
    Model = SMS
    RelationsToSchool = ['parentSchool__id']

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        data = {
            'parentSchool': activeSchoolID,
            'startDateTime': request.GET['startDateTime'],
            'endDateTime': request.GET['endDateTime']
        }
        return get_sms_list(data)


class SMSIdView(CommonView, APIView):
    Model = SMSId


class SMSIdListView(CommonListView, APIView):
    Model = SMSId


class SMSTemplateView(CommonView, APIView):
    Model = SMSTemplate


class SMSTemplateListView(CommonListView, APIView):
    Model = SMSTemplate


class SMSEventSettingsView(CommonView, APIView):
    Model = SMSEventSettings
    RelationsToSchool = ['parentSchool__id']


class SMSEventSettingsListView(CommonListView, APIView):
    Model = SMSEventSettings
    RelationsToSchool = ['parentSchool__id']


class SMSIdSchoolView(CommonView, APIView):
    Model = SMSIdSchool
    RelationsToSchool = ['parentSchool__id']


class SMSIdSchoolListView(CommonListView, APIView):
    Model = SMSIdSchool
    RelationsToSchool = ['parentSchool__id']


class SMSEventView(APIView):
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):  # return only the first element or one element
        return common_json_view_function(request.GET, "sms_app", "sms_event.json")[0]


class SMSPurchaseView(CommonView, APIView):
    Model = SMSPurchase
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']


class SMSPurchaseListView(CommonListView, APIView):
    Model = SMSPurchase
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']


class SMSEventListView(APIView):
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        return common_json_view_function(request.GET, "sms_app", "sms_event.json")


class SMSDefaultTemplateView(APIView):
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        return common_json_view_function(request.GET, "sms_app", "default_sms_templates.json")[0]


class SMSDefaultTemplateListView(APIView):
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        return common_json_view_function(request.GET, "sms_app", "default_sms_templates.json")


from .models import SmsPurchaseOrder


class SmsPurchaseOrderView(CommonView, APIView):
    Model = SmsPurchaseOrder
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']


class SmsPurchaseOrderListView(CommonListView, APIView):
    Model = SmsPurchaseOrder
    RelationsToSchool = ['parentSchool__id']
    permittedMethods = ['get']
