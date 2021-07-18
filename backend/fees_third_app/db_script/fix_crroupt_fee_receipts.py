def fix_crroupt_fee_receipts(app, schema_editor):
    FeeReceipt = app.get_model('fees_third_app', 'FeeReceipt')
    for fee_receipt in FeeReceipt.objects.filter(id__gte= 37641):
        try:
            if fee_receipt.parentTransacion:
                transaction__id = fee_receipt.parentTransacion.id # to check if parentTranscation exists 
        except:
            fee_receipt.parentTransacion = None
            fee_receipt.save()