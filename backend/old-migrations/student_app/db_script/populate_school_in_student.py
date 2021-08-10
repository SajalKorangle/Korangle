
from django.contrib.auth.models import User

def populate_school_in_student(apps, schema_editor):

    Student = apps.get_model('student_app', 'Student')

    for student_object in Student.objects.all():

        student_object.parentSchool = student_object.parentUser.school_set.all()[0]
        student_object.save()

    '''for user_object in User.objects.all():

        school_object_queryset = user_object.school_set.all()

        if school_object_queryset.count() == 1:
            school_object = school_object_queryset[0]
            for student_object in Student.objects.filter(parentUser=user_object):
                student_object.parentSchool = school_object
                student_object.save()
        elif school_object_queryset.count() > 1:
            print('Error: One User shouldn\'t have more than one school')'''
