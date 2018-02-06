from django.core.management.base import BaseCommand
from school_app.models import School
from django.contrib.auth.models import User

class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    def _create_tags(self):
        tlisp = Tag(name='Lisp')
        tlisp.save()

        tjava = Tag(name='Java')
        tjava.save()

    def handle(self, *args, **options):
        self._create_tags()

school_object = School()
user = User.objects.filter(username='anupreet')
school_object.name = 'ANUPREET'
school_object.primaryThemeColor = 'indigo';
school_object.secondaryThemeColor = 'primary';
school_object.printName = 'ANUPREET PVT ITI';
school_object.complexFeeStructure = True;
school_object.save()
school_object.user.add(user[0])

school_object = School()
user = User.objects.filter(username='brightstarsalsalai')
school_object.name = 'BRIGHTSTARSALSALAI'
school_object.primaryThemeColor = 'green';
school_object.secondaryThemeColor = 'warning';
school_object.printName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
school_object.complexFeeStructure = False;
school_object.save()
school_object.user.add(user[0])

school_object = School()
user = User.objects.filter(username='brighthindi')
school_object.name = 'BRIGHTHINDI'
school_object.primaryThemeColor = 'indigo';
school_object.secondaryThemeColor = 'primary';
school_object.printName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
school_object.complexFeeStructure = False;
school_object.save()
school_object.user.add(user[0])

school_object = School()
user = User.objects.filter(username='brightstar')
school_object.name = 'BRIGHTSTAR'
school_object.primaryThemeColor = 'green';
school_object.secondaryThemeColor = 'warning';
school_object.printName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
school_object.complexFeeStructure = False;
school_object.save()
school_object.user.add(user[0])

school_object = School()
user = User.objects.filter(username='eklavya')
school_object.name = 'EKLAVYA'
school_object.primaryThemeColor = 'indigo';
school_object.secondaryThemeColor = 'primary';
school_object.printName = 'Eklavya School';
school_object.complexFeeStructure = False;
school_object.save()
school_object.user.add(user[0])

school_object = School()
user = User.objects.filter(username='demo')
school_object.name = 'DEMO'
school_object.primaryThemeColor = 'green';
school_object.secondaryThemeColor = 'warning';
school_object.printName = 'Demo School';
school_object.complexFeeStructure = True;
school_object.save()
school_object.user.add(user[0])



