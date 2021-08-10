
def backshift_bhagatsingh_student(apps, schema_editor):

    StudentSection = apps.get_model('student_app', 'StudentSection')

    Section = apps.get_model('class_app', 'Section')

    Student = apps.get_model('student_app', 'Student')

    School = apps.get_model('school_app', 'School')

    Session = apps.get_model('school_app', 'Session')

    for student_object in Student.objects.filter(parentUser__username='bhagatsingh'):

        student_section_object = StudentSection.objects.get(parentStudent_id=student_object.id)

        className = student_section_object.parentSection.parentClassSession.parentClass.name
        sectionName = student_section_object.parentSection.name

        section_object = Section.objects.get(parentClassSession__parentSession__name='Session 2017-18',
                                             name=sectionName,
                                             parentClassSession__parentClass__name=className)

        student_section_object.parentSection = section_object

        student_section_object.save()

    school_object = School.objects.get(user__username='bhagatsingh')

    school_object.currentSession = Session.objects.get(name='Session 2017-18')

    school_object.save()



def populate_bhagatsingh_schoolSession(apps, schema_editor):

    SchoolSession = apps.get_model('school_app', 'SchoolSession')

    Session = apps.get_model('school_app', 'Session')

    School = apps.get_model('school_app', 'School')

    school_object = School.objects.get(user__username='bhagatsingh')

    session_object = Session.objects.get(name='Session 2017-18')

    school_session_object = SchoolSession(parentSchool = school_object,
                                          parentSession = session_object,
                                          workingDays = 224)
    school_session_object.save()

    school_object.printName = 'S.B.S. Convent H.S. School'
    school_object.address = 'Seminary Road, Ashta, Distt. Sehore, M.P.'

    school_object.save()

