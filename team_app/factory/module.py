
import factory


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'team_app.Task'
        django_get_or_create = ('path', 'title', 'orderNumber', 'parentModule')

    orderNumber = factory.sequence(lambda n: n)
    path = factory.LazyAttribute(lambda obj: 'path_%s' % obj.orderNumber)
    title = factory.LazyAttribute(lambda obj: '%s_title' % obj.path)


class ModuleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'team_app.Module'
        django_get_or_create = ('path', 'title', 'icon', 'orderNumber')

    orderNumber = factory.Sequence(lambda n: n)
    path = factory.LazyAttribute(lambda obj: 'path_%s' % obj.orderNumber)
    title = factory.LazyAttribute(lambda obj: '%s_title' % obj.path)
    icon = factory.LazyAttribute(lambda obj: '%s_icon' % obj.path)

    @factory.post_generation
    def create_task(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            index=0
            while(index<3):
                TaskFactory(parentModule=self)
                index += 1

