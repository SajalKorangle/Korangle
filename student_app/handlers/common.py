
# from school_app.session import get_current_session_object

from school_app.model.models import SubFee, Student, Fee

from django.db.models import Max

def populate_student_field(student_object, fieldName, fieldValue):
    if fieldName == 'category':
        setattr(student_object, 'newCategoryField', fieldValue)
    elif fieldName == 'religion':
        setattr(student_object, 'newReligionField', fieldValue)
    elif fieldName == 'rollNumber':
        pass
    else:
        setattr(student_object, fieldName, fieldValue)

'''def get_student_profile_with_fee(student_object, user):
    student_data = get_student_profile(student_object)

    student_data['feesList'] = []
    student_data['feesDue'] = student_object.totalFees
    receiptNumberMax = Fee.objects.filter(parentStudent__in=Student.objects.filter(parentUser=user)).aggregate(Max('receiptNumber'))
    student_data['overAllLastFeeReceiptNumber'] = receiptNumberMax['receiptNumber__max']
    for studentFeeEntry in student_object.fee_set.all():
        tempStudentFeeEntry = {}
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
    for studentConcessionEntry in student_object.concession_set.all():
        tempStudentConcessionEntry = {}
        tempStudentConcessionEntry['amount'] = studentConcessionEntry.amount
        tempStudentConcessionEntry['remark'] = studentConcessionEntry.remark
        tempStudentConcessionEntry['generationDateTime'] = studentConcessionEntry.generationDateTime
        tempStudentConcessionEntry['studentDbId'] = studentConcessionEntry.parentStudent.id
        student_data['feesDue'] -= studentConcessionEntry.amount
        student_data['concessionList'].append(tempStudentConcessionEntry)
    return student_data'''

def get_student_profile(student_object, session_object):
    student_data = {}
    student_data['name'] = student_object.name
    student_data['dbId'] = student_object.id
    student_data['fathersName'] = student_object.fathersName
    student_data['mobileNumber'] = student_object.mobileNumber
    student_data['dateOfBirth'] = student_object.dateOfBirth
    student_data['totalFees'] = student_object.totalFees
    student_data['remark'] = student_object.remark
    student_data['rollNumber'] = student_object.get_rollNumber(session_object)
    student_data['scholarNumber'] = student_object.scholarNumber
    student_data['motherName'] = student_object.motherName
    student_data['gender'] = student_object.gender
    student_data['caste'] = student_object.caste
    student_data['category'] = student_object.newCategoryField
    student_data['religion'] = student_object.newReligionField
    student_data['fatherOccupation'] = student_object.fatherOccupation
    student_data['address'] = student_object.address
    student_data['familySSMID'] = student_object.familySSMID
    student_data['childSSMID'] = student_object.childSSMID
    student_data['bankName'] = student_object.bankName
    student_data['bankAccountNum'] = student_object.bankAccountNum
    student_data['aadharNum'] = student_object.aadharNum
    student_data['bloodGroup'] = student_object.bloodGroup
    student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome

    student_data['sectionDbId'] = student_object.get_section_id(session_object)
    student_data['sectionName'] = student_object.get_section_name(session_object)
    student_data['className'] = student_object.get_class_id(session_object)
    student_data['classDbId'] = student_object.get_class_name(session_object)

    '''student_data['sectionDbId'] = student_object.get_section_id(student_object.school.currentSession)
    student_data['sectionName'] = student_object.get_section_name(student_object.school.currentSession)
    student_data['className'] = student_object.get_class_id(student_object.school.currentSession)
    student_data['classDbId'] = student_object.get_class_name(student_object.school.currentSession)'''

    student_data['feesDue'] = student_object.totalFees
    for studentFeeEntry in student_object.fee_set.all().order_by('-generationDateTime'):
        lateFeeAmount = 0
        lateFee = SubFee.objects.filter(parentFee=studentFeeEntry, particular='LateFee')
        if lateFee:
            lateFeeAmount = lateFee[0].amount

        student_data['feesDue'] -= studentFeeEntry.amount
        student_data['feesDue'] += lateFeeAmount
    for studentConcessionEntry in student_object.concession_set.all():
        student_data['feesDue'] -= studentConcessionEntry.amount

    return student_data
