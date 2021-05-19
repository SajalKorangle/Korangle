from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from .bussiness.zoom import generateSignature
from helloworld_project import settings


class ZoomMeetingSignature(CommonView, APIView):
    permittedMethods = ['get']

    @user_permission_3
    def get(self, request, *args, **kwargs):
        meetingSignatureData = {'apiKey': settings.ZOOM_API_KEY, 'apiSecret': settings.ZOOM_SECRET_KEY, 'meetingNumber': request.GET['meetingNumber'], 'role': int(request.GET['role'])}
        response = {'signature': generateSignature(meetingSignatureData), 'apiKey': settings.ZOOM_API_KEY}
        return response



from .models import OnlineClass
class OnlineClassView(CommonView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']


class OnlineClassListView(CommonListView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']


from .models import AccountInfo
class AccountInfoView(CommonView, APIView):
    Model = AccountInfo
    RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id']


class AccountInfoListView(CommonListView, APIView):
    Model = AccountInfo
    RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id']


from .models import RestrictedStudent
class RestrictedStudentView(CommonView, APIView):
    Model = RestrictedStudent
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

class RestrictedStudentListView(CommonListView, APIView):
    Model = RestrictedStudent
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']