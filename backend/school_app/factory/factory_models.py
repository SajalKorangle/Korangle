import factory

import datetime

from school_app.model.models import School, Session, SchoolSession

from django.contrib.auth import get_user_model
User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = User

class SchoolFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = School

class SessionFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Session

    startDate = factory.LazyFunction(datetime)
    endDate = factory.LazyFunction(datetime)

class SchoolSessionFactory(factory.django.DjangoModelFactory):

    parentSchool = factory.SubFactory(SchoolFactory)
    parentSession = factory.SubFactory(SessionFactory)

    class Meta:
        model = SchoolSession
