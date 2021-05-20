
from push_notifications.models import GCMDevice
from school_app.model.models import School
from sms_app.models import SMSIdSchool, SMSId


def send_notification(data_list):

    sms_id_school = SMSIdSchool.objects.get(parentSchool_id=data_list[0]['parentSchool'])
    print(sms_id_school.parentSMSId.id)
    school_sms_id = SMSId.objects.get(id=sms_id_school.parentSMSId.id).smsId
    fcm_devices = GCMDevice.objects.filter(user__in=list(map(lambda x: x['parentUser'], data_list)))
    fcm_devices.send_message(data_list[0]['content'], title=school_sms_id)
