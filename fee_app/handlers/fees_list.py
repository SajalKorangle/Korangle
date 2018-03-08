from school_app.models import Fee, SubFee
from school_app.session import get_current_session_object

def fees_list(data, user):
    fee_list = []

    for fee_object in Fee.objects.filter(parentStudent__parentUser=user,
                                  generationDateTime__gte=data['startDate'],
                                  generationDateTime__lte=data['endDate']).order_by('generationDateTime',
                                                                                    'receiptNumber'):
        tempFee = {}
        tempFee['receiptNumber'] = fee_object.receiptNumber
        tempFee['amount'] = fee_object.amount
        tempFee['generationDateTime'] = fee_object.generationDateTime
        tempFee['dbId'] = fee_object.id
        tempFee['studentName'] = fee_object.parentStudent.name
        tempFee['remark'] = fee_object.remark

        tempFee['tuitionFeeAmount'] = 0
        tuitionFee = SubFee.objects.filter(parentFee=fee_object, particular='TuitionFee')
        if tuitionFee:
            tempFee['tuitionFeeAmount'] = tuitionFee[0].amount

        tempFee['lateFeeAmount'] = 0
        lateFee = SubFee.objects.filter(parentFee=fee_object, particular='LateFee')
        if lateFee:
            tempFee['lateFeeAmount'] = lateFee[0].amount

        tempFee['cautionMoneyAmount'] = 0
        cautionMoney = SubFee.objects.filter(parentFee=fee_object, particular='CautionMoney')
        if cautionMoney:
            tempFee['cautionMoneyAmount'] = cautionMoney[0].amount

        tempFee['className'] = fee_object.parentStudent.friendSection \
            .get(parentClassSession__parentSession=get_current_session_object()) \
            .parentClassSession.parentClass.name
        fee_list.append(tempFee)

    return fee_list
