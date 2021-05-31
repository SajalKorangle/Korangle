from django.http import JsonResponse
from rest_framework.response import Response
from permissions import employeeHasSchoolPermission, parentHasStudentPermission
from student_app.models import Student


def get_error_response(message):
    error_response = {}
    error_response['status'] = 'fail'
    error_response['message'] = message
    return error_response


def get_success_response(data):
    message_response = {}
    message_response['status'] = 'success'
    message_response['data'] = data
    return message_response


# deprecated, don't use anymore
def user_permission(function):
    def wrap(self, request, *args, **kwargs):
        if ('method' in request.GET and request.GET['method'] == 'GET'):
            request.GET._mutable = True
            for key in request.data:
                request.GET[key] = request.data[key]
            del request.GET['method']
            request.GET._mutable = False
            return self.get(request)

        if request.user.is_authenticated:
            data = {'response': get_success_response(function(request, *args, **kwargs))}
            return JsonResponse(data)
        else:
            return JsonResponse(
                {'response': get_error_response('User is not authenticated, logout and login again.')})
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


# deprecated, don't use anymore
def user_permission_new(function):
    def wrap(*args, **kwargs):
        request = args[1]

        if ('method' in request.GET and request.GET['method'] == 'GET'):
            request.GET._mutable = True
            for key in request.data:
                request.GET[key] = request.data[key]
            del request.GET['method']
            request.GET._mutable = False
            return args[0].get(request)

        if request.user.is_authenticated:
            # Deleting activeSchoolId or activeStudentId keys from get; introduced by updated architecture
            if ('activeSchoolID' in request.GET.keys()):    # User is requesting as employee
                request.GET._mutable = True
                del request.GET['activeSchoolID']
                request.GET._mutable = False
            elif ('activeStudentID' in request.GET.keys()):  # User is requesting as parent
                request.GET._mutable = True
                del request.GET['activeStudentID']
                request.GET._mutable = False

            data = {'response': get_success_response(function(*args, **kwargs))}
            return JsonResponse(data)
        else:
            return JsonResponse(
                {'response': get_error_response('User is not authenticated, logout and login again.')})
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def user_permission_3(function):
    def wrap(*args, **kwargs):
        request = args[1]

        if ('method' in request.GET and request.GET['method'] == 'GET'):
            request.GET._mutable = True
            for key in request.data:
                request.GET[key] = request.data[key]
            del request.GET['method']
            request.GET._mutable = False
            return args[0].get(request)

        # no need to check authentication because the RestAPIView class by default check for authentication

        if ('activeSchoolID' in request.GET.keys()):    # User is requesting as employee
            activeSchoolID = request.GET['activeSchoolID']
            if employeeHasSchoolPermission(request.user, activeSchoolID):
                request.GET._mutable = True
                del request.GET['activeSchoolID']
                request.GET._mutable = False
                data = {'response': get_success_response(function(*args, **kwargs, activeSchoolID=int(activeSchoolID), activeStudentID=None))}
                return Response(data)
            else:
                return Response({'response': get_error_response('Permission Issue')})

        elif ('activeStudentID' in request.GET.keys()):  # User is requesting as parent
            activeStudentID = list(map(int, request.GET['activeStudentID'].split(',')))  # activeStudentID can be a single id or a list of id's seperated by ','
            hasPermission = True
            for studentID in activeStudentID:
                hasPermission = hasPermission and parentHasStudentPermission(request.user, studentID)
            if (hasPermission):
                request.GET._mutable = True
                del request.GET['activeStudentID']
                request.GET._mutable = False
                activeSchoolID = Student.objects.get(id=activeStudentID[0]).parentSchool.id
                data = {'response': get_success_response(function(*args, **kwargs, activeSchoolID=int(activeSchoolID), activeStudentID=activeStudentID))}
                return Response(data)
            else:
                return Response({'response': get_error_response('Permission Issue')})

        else:
            data = {'response': get_success_response(
                function(*args, **kwargs, activeSchoolID=None, activeStudentID=None))}
            return Response(data)
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
