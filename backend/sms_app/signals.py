from school_app.model.models import School


def sms_sender(sender, created, instance, **kwargs):
    if created:
        from sms_app.business.send_sms import send_sms
        requestId = send_sms(instance.__dict__)
        if requestId == 0:
            print('fail')
            instance.count = 0
            instance.save()
        else:
            print('success')
            instance.requestId = requestId
            instance.save()
            print(instance.requestId)


def add_sms_balance(sender, created, instance, **kwargs):
    school_object = School.objects.get(id=instance['parentSchool'])
    school_object.smsBalance = school_object.smsBalance + instance['numberOfSMS']
    school_object.save()

