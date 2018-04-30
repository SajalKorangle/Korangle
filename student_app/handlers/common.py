
from fee_app.models import SubFee

from school_app.model.models import BusStop

def populate_student_field(student_object, fieldName, fieldValue):
    if fieldName == 'category':
        setattr(student_object, 'newCategoryField', fieldValue)
    elif fieldName == 'religion':
        setattr(student_object, 'newReligionField', fieldValue)
    elif fieldName == 'busStopDbId':
        if fieldValue is not None:
            student_object.currentBusStop = BusStop.objects.get(id=fieldValue)
        else:
            student_object.currentBusStop = None
    elif fieldName == 'rollNumber':
        pass
    else:
        setattr(student_object, fieldName, fieldValue)

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
    student_data['rte'] = student_object.rte
    if student_object.currentBusStop is not None:
        student_data['busStopDbId'] = student_object.currentBusStop.id
    else:
        student_data['busStopDbId'] = None

    student_data['sectionDbId'] = student_object.get_section_id(session_object)
    student_data['sectionName'] = student_object.get_section_name(session_object)
    student_data['className'] = student_object.get_class_id(session_object)
    student_data['classDbId'] = student_object.get_class_name(session_object)

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
