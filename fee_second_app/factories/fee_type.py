import factory


class FeeTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.FeeType'
        django_get_or_create = ('name',)

    name = 'Test Fee'

