def add_default_fee_receipt_book(apps, schema_editor):
    School = apps.get_model('school_app', 'School')
    FeeReceiptBook = apps.get_model('fees_third_app', 'FeeReceiptBook')
    FeeReceipt = apps.get_model('fees_third_app', 'FeeReceipt')

    for school in School.objects.all():
        feeReceiptBook = FeeReceiptBook(
            parentSchool=school,
            name='Default',
        )
        feeReceiptBook.save()
        for fee_receipt in FeeReceipt.objects.filter(parentSchool=school):
            fee_receipt.parentFeeReceiptBook = feeReceiptBook
            fee_receipt.save()

