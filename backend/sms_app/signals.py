def sms_sender(sender, created, instance, **kwargs):
    if created:
        from sms_app.business.send_sms import send_sms
        print('hello')
        requestId = send_sms(instance.__dict__)
        if requestId == 0:
            instance.count = 0
            instance.save()
        else:
            instance.requestId = requestId
            instance.save()
            print(instance.requestId)

