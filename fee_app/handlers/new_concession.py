# from school_app.model.models import Concession, Student

from student_app.models import Student

from fee_app.models import Concession

from fee_app.handlers.submit_fee import get_student_fee_data

def new_concession(data, user):
    Concession.objects.create(amount=data['amount'], remark=data['remark'], parentStudent=Student.objects.get(id=data['studentDbId']))
    response = {}
    response['message'] = 'Concession submitted successfully'
    response['studentData'] = get_student_fee_data(data, user)
    return response
