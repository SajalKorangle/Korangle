
from school_app.model.models import Session


def get_session_list():

    session_list = []

    for session_object in Session.objects.all().order_by('orderNumber'):
        temp_session_response = {
            'dbId': session_object.id,
            'name': session_object.name,
            'orderNumber': session_object.orderNumber,
        }
        session_list.append(temp_session_response)

    return session_list