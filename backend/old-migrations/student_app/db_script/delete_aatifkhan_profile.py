
def delete_aatifkhan_profile(apps, schema_editor):

    SubFee = apps.get_model('fee_app', 'SubFee')
    Fee = apps.get_model('fee_app', 'Fee')
    Concession = apps.get_model('fee_app', 'Concession')

    StudentTestResult = apps.get_model('examination_app', 'StudentTestResult')

    StudentSection = apps.get_model('student_app', 'StudentSection')
    Student = apps.get_model('student_app', 'Student')

    student_object = Student.objects.get(id=912)

    SubFee.objects.filter(parentFee__parentStudent=student_object).delete()
    Fee.objects.filter(parentStudent=student_object).delete()
    Concession.objects.filter(parentStudent=student_object).delete()

    StudentTestResult.objects.filter(parentStudent=student_object).delete()

    StudentSection.objects.filter(parentStudent=student_object).delete()
    Student.objects.get(id=912).delete()

