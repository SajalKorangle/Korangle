
def delete_unknown_rte(apps,schema_editor):
    Student = apps.get_model('student_app', 'Student')
    for student in Student.objects.all():
        if student.rte == 'UNKNOWN':
            student.rte = 'NO'
            student.save()