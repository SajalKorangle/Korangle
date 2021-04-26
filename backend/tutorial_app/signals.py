from information_app.models import SentUpdateType
from sms_app.models import SMSEventSettings, SMSEvent, SMSId


def send_update(sender, instance, created, **kwargs):
    if created:
        sms_event = SMSEvent.objects.get(eventName='Tutorial Creation')
        creation_event_settings = SMSEventSettings.objects.get(parentSMSEvent=sms_event.id)
        if creation_event_settings.parentSentUpdateType == SentUpdateType.objects.get(name='SMS'):
            sms_data = {}
            if creation_event_settings.parentSMSTemplate is None:
                sms_data['content'] = sms_event.defaultSMSContent
                sms_data['smsId'] = SMSId.objects.get(smsId='KORNGL')
            else:
                sms_data['content'] = sms_event.defaultSMSContent
                sms_data['smsId'] = SMSId.objects.get(smsId='KORNGL')
            sms_data['contentType'] = 'english'
            sms_data['mobileNumbers'] = 'getMobileNumbers()'