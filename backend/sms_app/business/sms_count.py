
from django.db.models import Sum
from sms_app.models import SMS, SMSPurchase


def get_sms_count(data):

    purchase_count = SMSPurchase.objects.filter(parentSchool_id=data['parentSchool']) \
        .aggregate(purchaseCount=Sum('numberOfSMS'))['purchaseCount']

    if purchase_count is None:
        purchase_count = 0

    spent_count = SMS.objects.filter(parentSchool_id=data['parentSchool']) \
        .aggregate(spentCount=Sum('count'))['spentCount']

    if spent_count is None:
        spent_count = 0

    return {'count': purchase_count - spent_count }
