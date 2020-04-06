
import factory

from school_app.model.models import School, BusStop, Session
from class_app.models import Division, Class


class StudentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'student_app.Student'
        django_get_or_create=('name', 'fathersName', 'parentSchool', 'currentBusStop')

    name = 'dummy'
    fathersName = 'dummy'

    # parentUser = School.objects.get(name='BRIGHT STAR').user.all()[0]
    parentSchool = School.objects.get(name='BRIGHT STAR')

    currentBusStop = BusStop.objects.filter(parentSchool=School.objects.get(name='BRIGHT STAR'))[0]

    @factory.post_generation
    def studentSection(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            StudentSectionFactory(parentStudent=self)


class StudentSectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'student_app.StudentSection'
        django_get_or_create=('parentStudent', 'parentDivision', 'parentClass', 'parentSession', 'rollNumber')

    parentStudent = factory.SubFactory(StudentFactory)
    parentDivision = Division.objects.get(name='Section - A')
    parentClass = Class.objects.get(name='Class - 12')
    parentSession = Session.objects.get(name='Session 2017-18')
    rollNumber = '123'

