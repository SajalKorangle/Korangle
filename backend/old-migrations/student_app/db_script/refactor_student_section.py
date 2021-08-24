
def refactor_student_section(apps, schema_editor):

    StudentSection = apps.get_model('student_app', 'StudentSection')
    Division = apps.get_model('class_app', 'Division')

    for student_section_object in StudentSection.objects.all():
        student_section_object.parentClass = \
            student_section_object.parentSection.parentClassSession.parentClass
        student_section_object.parentSession = \
            student_section_object.parentSection.parentClassSession.parentSession
        student_section_object.parentDivision = \
            Division.objects.get(name=student_section_object.parentSection.name)
        student_section_object.save()

