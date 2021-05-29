import time
import json
from .models import APIResponse
from school_app.model.models import School


class APIStats:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        startTime = time.time()
        activeSchoolId = request.GET.get('activeSchoolID', None)

        response = self.get_response(request)

        endTime = time.time()
        if(not request.path.startswith('/admin')):
            APIResponse.objects.create(
                parentSchool=School.objects.get(id=activeSchoolId) if activeSchoolId else None,
                path=request.path,
                method=request.method,
                queryString=json.dumps(request.GET),
                responseSize=len(response.content),
                responseTime=endTime-startTime
            )
        return response
