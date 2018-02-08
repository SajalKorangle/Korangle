from django.core.management.base import BaseCommand
from school_app.models import Student
from django.contrib.auth.models import User

class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    def _create_tags(self):
        '''tlisp = Tag(name='Lisp')
        tlisp.save()

        tjava = Tag(name='Java')
        tjava.save()'''

    def handle(self, *args, **options):
        self._create_tags()

for student_object in Student.objects.all():
	if student_object.category:
		if student_object.category == 'Scheduled Caste':
			student_object.newCategoryField = 'SC'
		if student_object.category == 'Scheduled Tribe':
			student_object.newCategoryField = 'ST'
		if student_object.category == 'Other Backward Classes':
			student_object.newCategoryField = 'OBC'
		if student_object.category == 'General':
			student_object.newCategoryField = 'Gen.'
		student_object.save()
	if student_object.religion:
		print(student_object.name+' --- '+student_object.religion)
		if student_object.religion == 'Hinduism':
			student_object.newReligionField = 'Hinduism'
		if student_object.religion == 'Islam':
			student_object.newReligionField = 'Islam'
		if student_object.religion == 'Christianity':
			student_object.newReligionField = 'Christianity'
		if student_object.religion == 'Jainism':
			student_object.newReligionField = 'Jainism'
		student_object.save()
