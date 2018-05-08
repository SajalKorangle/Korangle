
import factory

from school_app.model.models import Session

class SchoolFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'school_app.School'
        django_get_or_create = ('name', 'printName', 'address', 'diseCode', 'registrationNumber', 'currentSession')

    name = 'Test'
    printName = 'Print Test'
    address = 'Test Address'
    diseCode = 'Test Dise Code'
    registrationNumber = 'Test Registration Number'
    currentSession = Session.objects.get(name='Session 2017-18')