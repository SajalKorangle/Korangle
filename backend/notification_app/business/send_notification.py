
from push_notifications.models import GCMDevice


# def send_notification(data_list):

#     school_sms_id = School.objects.get(id=data_list[0]['parentSchool']).smsId
#     fcm_devices = GCMDevice.objects.filter(user__in=list(map(lambda x: x['parentUser'], data_list)))
#     fcm_devices.send_message(data_list[0]['content'], title=school_sms_id)

def send_notification(data):

    school_sms_id = data.parentSchool.smsId
    fcm_devices = GCMDevice.objects.filter(user=data.parentUser)
    fcm_devices.send_message(data.content, title=school_sms_id)
