
def populate_date_of_admission(apps, schema_editor):

    TransferCertificate = apps.get_model('student_app', 'TransferCertificate')

    for transfer_certificate_object in TransferCertificate.objects.all():
        student_object = transfer_certificate_object.student_set.all()[0]
        student_object.dateOfAdmission = transfer_certificate_object.admissionDate
        student_object.save()
