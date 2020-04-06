from django.http import JsonResponse


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


def user_permission(function):
    def wrap(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            data = {'response': get_success_response(function(request, *args, **kwargs))}
            return JsonResponse(data)
        else:
            return JsonResponse(
                {'response': get_error_response('User is not authenticated, logout and login again.')})
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def user_permission_new(function):
    def wrap(*args, **kwargs):
        if args[1].user.is_authenticated:
            data = {'response': get_success_response(function(*args, **kwargs))}
            return JsonResponse(data)
        else:
            return JsonResponse(
                {'response': get_error_response('User is not authenticated, logout and login again.')})
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap

