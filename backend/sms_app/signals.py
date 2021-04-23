from sms_app.business.send_sms import send_different_sms


def sms_sender(sender, instance, created, **kwargs):
      return_data=send_different_sms(instance)
      instance['requestId'] = return_data['requestId']
      print(instance.requestId)



