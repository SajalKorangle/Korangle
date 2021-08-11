from push_notifications.models import GCMDevice
from sms_app.models import SMSIdSchool, SMSId


def send_notification(data):
    sms_id_school = SMSIdSchool.objects.filter(parentSchool_id=data.parentSchool.id)
    if sms_id_school.exists():
        sms_id = SMSId.objects.get(id=sms_id_school[0].parentSMSId.id).smsId
    else:
        sms_id = 'KORNGL'
    fcm_devices = GCMDevice.objects.filter(user=data.parentUser)
    fcm_devices.send_message(data.content, title=sms_id)
