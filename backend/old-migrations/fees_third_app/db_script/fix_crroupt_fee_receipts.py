def fix_crroupt_fee_receipts(app, schema_editor):
    FeeReceipt = app.get_model('fees_third_app', 'FeeReceipt')
    for fee_receipt in FeeReceipt.objects.filter(id__gte= 37641):
        try:
            if fee_receipt.parentTransaction:
                transaction__id = fee_receipt.parentTransaction.id # to check if parentTranscation exists 
                transaction__id += 1    # dummy operation 
        except:
            fee_receipt.parentTransaction = None
            fee_receipt.save()