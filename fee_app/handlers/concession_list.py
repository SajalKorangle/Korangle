from school_app.model.models import Concession
# from school_app.session import get_current_session_object

def concession_list(data, user):
    concession_list = []

    for concession in Concession.objects.filter(parentStudent__parentUser=user,
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
