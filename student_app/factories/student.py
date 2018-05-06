
import factory

from school_app.model.models import School, BusStop
from class_app.models import Section


class StudentSectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'student_app.StudentSection'
        django_get_or_create=('parentStudent', 'parentSection')

    parentSection = Section.objects.get(parentClassSession__parentClass__name='Class - 12',
                                        name='Section - A',
                                        parentClassSession__parentSession__name='Session 2017-18')


class StudentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'student_app.Student'
        django_get_or_create=('name', 'fathersName', 'parentUser', 'currentBusStop')

    name = 'dummy'
    fathersName = 'dummy'

    parentUser = School.objects.get(name='BRIGHT STAR').user.all()[0]

    currentBusStop = BusStop.objects.filter(parentSchool=School.objects.get(name='BRIGHT STAR'))[0]

    @factory.post_generation
    def studentSection(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            StudentSectionFactory(parentStudent=self)

