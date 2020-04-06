
import factory


class MsgClubDeliveryReportFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'sms_app.MsgClubDeliveryReport'
        django_get_or_create = ('requestId', 'mobileNumber', 'status', 'statusCode', 'senderId')

    requestId = factory.Sequence(lambda n: 'request_%s' % n)
    mobileNumber = factory.Sequence(lambda n: n)
    status = 'DELIVERED'
    statusCode = '4001'
    senderId = 'KORNGL'
