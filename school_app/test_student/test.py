from django.test import TestCase
from school_app.models import Student, Class, User, SessionClass, Session

from school_app.session import get_current_session_object

# current_session_object = get_current_session_object()

class StudentUpdateProfileTestCase(TestCase):

	# Constraint Check
	def test_constraint_one_class_per_session(self):
		for user_object in User.objects.all():
			for class_object in user_object.class_set.all().order_by('orderNumber'):
				session_class_queryset = SessionClass.objects.filter(parentSession=get_current_session_object(),parentClass=class_object)
				self.assertEqual(len(session_class_queryset),1, user_object.username + ' --- ' + get_current_session_object().name + ' --- ' + class_object.name)
