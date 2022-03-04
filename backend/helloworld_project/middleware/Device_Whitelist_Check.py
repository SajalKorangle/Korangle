from rest_framework.response import Response
from django.http import HttpResponseForbidden
from authentication_app.models import DeviceList
import datetime

class DeviceWhitelistCheck:

    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        if 'Authorization' in request.headers:
            userToken = request.headers['Authorization'].split()[1]
            jwtEntry = DeviceList.objects.filter(token = userToken)

            if len(jwtEntry)>=1 :
                jwtEntry[0].last_active_date = datetime.datetime.now().date()
                jwtEntry[0].save()
                response = self.get_response(request)
            else :
                return HttpResponseForbidden()
        else :
            response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response