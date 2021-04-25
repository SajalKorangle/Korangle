from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from .bussiness.zoom import generateSignature


class ZoomMettingSignature(CommonView, APIView):
    permittedMethods = ['get']

    @user_permission_3
    def get(self, request, *args, **kwargs):
        mettingSignatureData = {'apiKey': API_KEY , 'apiSecret': SECRET_KEY, 'meetingNumber': request.GET['mettingNumber'], 'role': int(request.GET['role'])}
        response = {'signature': generateSignature(mettingSignatureData)}
        return response



from .models import OnlineClass

class OnlineClassView(CommonView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']


class OnlineClassListView(CommonListView, APIView):
    Model = OnlineClass
    RelationsToSchool = ['parentSchool__id']

