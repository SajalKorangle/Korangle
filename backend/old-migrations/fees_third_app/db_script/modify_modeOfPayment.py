

def modify_modeOfPayment(apps, schema_editor):

    modeOfPayment = apps.get_model('fees_third_app', 'FeeReceipt')

    qs = modeOfPayment.objects.filter(modeOfPayment="Check")
    for item in qs:
        item.modeOfPayment = "Cheque"
        item.save()
