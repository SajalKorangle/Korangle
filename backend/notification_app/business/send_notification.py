from push_notifications.models import GCMDevice


def send_notification(data):

    school_name = 'KORANGLE'
    if data.parentSchool:
        school_name = data.parentSchool.name
    fcm_devices = GCMDevice.objects.filter(user=data.parentUser)
    fcm_devices.send_message(data.content, title=school_name)
