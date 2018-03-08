from school_app.models import Fee, SubFee, Student

from fee_app.handlers.common import get_student_fee_data

def new_fee_receipt(data, user):

    response = {}
    if Fee.objects.filter(receiptNumber=data['receiptNumber']):
        response['status'] = 'fail'
        response['message'] = 'Failed: Receipt Number already exists'
        return response

    fee_receipt_object = Fee.objects.create(receiptNumber=data['receiptNumber'], amount=data['amount'],
                                            generationDateTime=data['generationDateTime'],
                                            remark=data['remark'], parentStudent=Student.objects.get(id=data['studentDbId']))

    if 'tuitionFeeAmount' in data and data['tuitionFeeAmount'] != 0:
        SubFee.objects.create(particular='TuitionFee', amount=data['tuitionFeeAmount'],parentFee=fee_receipt_object)
    if 'lateFeeAmount' in data and data['lateFeeAmount'] != 0:
        SubFee.objects.create(particular='LateFee', amount=data['lateFeeAmount'],parentFee=fee_receipt_object)
    if 'cautionMoneyAmount' in data and data['cautionMoneyAmount'] != 0:
        SubFee.objects.create(particular='CautionMoney', amount=data['cautionMoneyAmount'],parentFee=fee_receipt_object)

    response['status'] = 'success'
    response['message'] = 'Fee submitted successfully'
    student_data = get_student_fee_data(data, user)
    response['studentData'] = student_data
    return response
