def approval_model_fix(apps, schema_editor):
    Approval = apps.get_model('accounts_app', 'Approval')
    Session = apps.get_model('school_app', 'Session')
    for approalInstance in Approval.objects.all():
        approalInstance.parentSession = Session.objects.get(startDate__lte=approalInstance.requestedGenerationDateTime, endDate__gte=approalInstance.requestedGenerationDateTime)
        if (approalInstance.parentEmployeeRequestedBy):
            approalInstance.parentSchool = approalInstance.parentEmployeeRequestedBy.parentSchool
            approalInstance.save()
        elif (approalInstance.parentEmployeeApprovedBy):
            approvalInstance.parentSchool = approalInstance.parentEmployeeApprovedBy.parentSchool
            approalInstance.save()
        else:
            approalInstance.delete()

def delete_inconsistant_transactions(apps, schema_editor):
    Transaction = apps.get_model('accounts_app', 'Transaction')
    for t in Transaction.objects.all():
        if (t.transactionaccountdetails_set.all().count() == 0):
            t.delete()
