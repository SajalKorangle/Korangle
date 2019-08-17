
from push_notifications.models import GCMDevice
from school_app.model.models import School


def create_notification_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(create_notification_object(data, Model, ModelSerializer))
    return return_data


def create_notification_object(data, Model, ModelSerializer):

    serializer = ModelSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return serializer.data
    else:
        return 'Creation failed'


def send_notification(data_list):

    school_sms_id = School.objects.get(id=data_list[0].parentSchool).smsId
    fcm_devices = GCMDevice.objects.filter(user__in=list(map(lambda x: x['user'], data_list)))
    fcm_devices.send_message(data_list[0].content, title=school_sms_id)
