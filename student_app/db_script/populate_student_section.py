
def populate_student_section(apps, schema_editor):

    Student = apps.get_model('school_app', 'Student')
    StudentSection = apps.get_model('student_app', 'StudentSection')

    for student_object in Student.objects.all():
        for section_object in student_object.friendSection.all():
            student_section_object = StudentSection(parentStudent=student_object, parentSection=section_object, rollNumber=student_object.rollNumber)
            student_section_object.save()

    if Student.objects.all().count() != StudentSection.objects.all().count():
        print('Student & StudentSection count is not matching')
    else:
        print('Student & StudentSection count is matching')

