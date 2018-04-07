# from school_app.model.models import Student, Fee, SubFee

from student_app.models import Student

from fee_app.models import Fee, SubFee

from django.db.models import Max

def get_student_fee_data(data, user):

    student_object = Student.objects.get(id=data['studentDbId'])

    student_data = {}

    # student_data['name'] = student_object.name
    student_data['dbId'] = student_object.id
    student_data['fathersName'] = student_object.fathersName
    student_data['scholarNumber'] = student_object.scholarNumber
    student_data['totalFees'] = student_object.totalFees
    student_data['remark'] = student_object.remark

    student_data['feesList'] = []
    student_data['feesDue'] = student_object.totalFees
    receiptNumberMax = Fee.objects.filter(parentStudent__in=Student.objects.filter(parentUser=user)).aggregate(Max('receiptNumber'))
    student_data['overAllLastFeeReceiptNumber'] = receiptNumberMax['receiptNumber__max']
    for studentFeeEntry in student_object.fee_set.all().order_by('-generationDateTime', 'id'):
        tempStudentFeeEntry = {}
        tempStudentFeeEntry['dbId'] = studentFeeEntry.id
        tempStudentFeeEntry['receiptNumber'] = studentFeeEntry.receiptNumber
        tempStudentFeeEntry['amount'] = studentFeeEntry.amount
        tempStudentFeeEntry['remark'] = studentFeeEntry.remark
        tempStudentFeeEntry['generationDateTime'] = studentFeeEntry.generationDateTime
        tempStudentFeeEntry['studentDbId'] = studentFeeEntry.parentStudent.id

        tempStudentFeeEntry['tuitionFeeAmount'] = 0
        tuitionFee = SubFee.objects.filter(parentFee=studentFeeEntry, particular='TuitionFee')
        if tuitionFee:
            tempStudentFeeEntry['tuitionFeeAmount'] = tuitionFee[0].amount

        tempStudentFeeEntry['lateFeeAmount'] = 0
        lateFee = SubFee.objects.filter(parentFee=studentFeeEntry, particular='LateFee')
        if lateFee:
            tempStudentFeeEntry['lateFeeAmount'] = lateFee[0].amount

        tempStudentFeeEntry['cautionMoneyAmount'] = 0
        cautionMoney = SubFee.objects.filter(parentFee=studentFeeEntry, particular='CautionMoney')
        if cautionMoney:
            tempStudentFeeEntry['cautionMoneyAmount'] = cautionMoney[0].amount

        student_data['feesDue'] -= tempStudentFeeEntry['amount']
        student_data['feesDue'] += tempStudentFeeEntry['lateFeeAmount']
        student_data['feesList'].append(tempStudentFeeEntry)

    student_data['concessionList'] = []
    for studentConcessionEntry in student_object.concession_set.all().order_by('-generationDateTime', 'id'):
        tempStudentConcessionEntry = {}
        tempStudentConcessionEntry['dbId'] = studentConcessionEntry.id
        tempStudentConcessionEntry['amount'] = studentConcessionEntry.amount
        tempStudentConcessionEntry['remark'] = studentConcessionEntry.remark
        tempStudentConcessionEntry['generationDateTime'] = studentConcessionEntry.generationDateTime
        tempStudentConcessionEntry['studentDbId'] = studentConcessionEntry.parentStudent.id
        student_data['feesDue'] -= studentConcessionEntry.amount
        student_data['concessionList'].append(tempStudentConcessionEntry)
    return student_data

