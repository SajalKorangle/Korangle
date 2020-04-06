

def delete_schools(apps, schema_editor):

    delete_school_by_name('SSVM', apps)
    delete_school_by_name('Bachpan', apps)
    delete_school_by_name('Sardar Patel', apps)
    delete_school_by_name('Sunrise', apps)

    delete_school_by_username('talentshujalpur', apps)

    User = apps.get_model('auth', 'User')
    User.objects.get(username='tempuser').delete()
    User.objects.get(username='ganeshsaraswati').delete()


def delete_school_by_username(username, apps):

    User = apps.get_model('auth', 'User')

    user_object = User.objects.get(username=username)
    school_object = user_object.school_set.all()[0]

    delete_students_by_school_object(school_object, apps)

    user_object.delete()
    school_object.delete()


def delete_school_by_name(school_name, apps):

    School = apps.get_model('school_app', 'School')

    school_object = School.objects.get(name=school_name)

    delete_students_by_school_object(school_object, apps)

    school_object.user.all()[0].delete()
    school_object.delete()


def delete_students_by_school_object(school_object, apps):

    StudentSection = apps.get_model('student_app', 'StudentSection')
    Student = apps.get_model('student_app', 'Student')

    StudentSection.objects.filter(parentStudent__parentSchool=school_object).delete()
    Student.objects.filter(parentSchool=school_object).delete()
