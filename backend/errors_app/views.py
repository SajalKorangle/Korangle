from common.common_views_3 import CommonView, CommonListView, APIView
from .models import Error
from django.http import HttpResponseForbidden


class ReportErrorView(CommonView, APIView): # only post method is allowed
    permission_classes = [] # To remove IsAuthenticated permission class
    Model = Error
    unpermittedMethods = ['get', 'put', 'patch', 'delete' ]

