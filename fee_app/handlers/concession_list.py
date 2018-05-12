# from school_app.model.models import Concession
# from school_app.session import get_current_session_object

from fee_app.models import Concession

def concession_list(data, user):
    concession_list = []

    school_object = user.school_set.all()[0]

    for concession in Concession.objects.filter(parentStudent__parentSchool=school_object,
                                                generationDateTime__gte=data['startDate'],
                                                generationDateTime__lte=data['endDate']).order_by('generationDateTime', 'id'):
        tempConcession = {}
        tempConcession['dbId'] = concession.id
        tempConcession['amount'] = concession.amount
        tempConcession['generationDateTime'] = concession.generationDateTime
        tempConcession['studentName'] = concession.studentName
        tempConcession['scholarNumber'] = concession.parentStudent.scholarNumber
        '''tempConcession['className'] = concession.className'''
        tempConcession['remark'] = concession.remark
        concession_list.append(tempConcession)

    return concession_list
