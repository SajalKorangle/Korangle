def add_payment_gateway_details(apps, schema_editor):

    PaymentGateway = apps.get_model('payment_app', 'PaymentGateway')
    ModeOfPayment = apps.get_model('payment_app', 'ModeOfPayment')
    ModeOfPaymentCharges = apps.get_model('payment_app', 'ModeOfPaymentCharges')


    easebuzzPaymentGatewayObject = PaymentGateway.objects.create(name='Easebuzz')
    
    modeOfPaymentList = [
        {
            'name': 'Debit Card',
            'apiCode': 'DC',
            'chargesList': [
                {'chargeType': 'Flat', 'charge': 9, 'maximumAmount': 1999.99},
                {'chargeType': 'Flat', 'charge': 20, 'minimumAmount': 2000}
            ]
        },
        {
            'name': 'Net Banking',
            'apiCode': 'NB',
            'chargesList': [
                {'chargeType': 'Flat', 'charge': 17}
            ]
        },
        {'name': 'UPI', 'apiCode': 'UPI', 'chargesList': [{'chargeType': 'Flat', 'charge': 5}]},
        {'name': 'Credit Card', 'apiCode': 'CC', 'chargesList': [{'chargeType': 'Percentage', 'charge': 1}]},
        {'name': 'Mobile Wallet', 'apiCode': 'MW', 'chargesList': [{'chargeType': 'Percentage', 'charge': 1.85}]},
        {'name': 'Ola Money', 'apiCode': 'OM', 'chargesList': [{'chargeType': 'Percentage', 'charge': 2.2}]},
        {'name': 'EMI', 'apiCode': 'EMI', 'chargesList': [{'chargeType': 'Percentage', 'charge': 2}]}
    ]

    for modeOfPayment in modeOfPaymentList:

        print(modeOfPayment)

        modeOfPaymentObject = ModeOfPayment.objects.create(
            name = modeOfPayment['name'],
            parentPaymentGateway = easebuzzPaymentGatewayObject,
            apiCode = modeOfPayment['apiCode']
        )

        for charge in modeOfPayment['chargesList']:

            chargeObject = ModeOfPaymentCharges.objects.create(
                parentModeOfPayment=modeOfPaymentObject,
                chargeType = charge['chargeType'],
                charge=charge['charge']
            )

            if 'minimumAmount' in charge:
                chargeObject.minimumAmount = charge['minimumAmount']
                chargeObject.save()
            
            if 'maximumAmount' in charge:
                chargeObject.maximumAmount = charge['maximumAmount']
                chargeObject.save()
