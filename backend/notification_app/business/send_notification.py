from push_notifications.models import GCMDevice
from sms_app.models import SMSIdSchool, SMSId


def send_notification(data):
    sms_id_school = SMSIdSchool.objects.get(parentSchool_id=data['parentSchool'])
    sms_id = SMSId.objects.get(id=sms_id_school.parentSMSId.id).smsId
    fcm_devices = GCMDevice.objects.filter(user=data.parentUser)
    fcm_devices.send_message(data.content, title=sms_id)
