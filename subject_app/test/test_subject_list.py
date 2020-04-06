from parent_test import ParentTestCase

from subject_app.handlers.subject_list import subject_list

from subject_app.models import Subject

class ViewsTestCase(ParentTestCase):

    def test_subject_list(self):

        response = subject_list()

        self.assertEqual(len(response), Subject.objects.count())

        index = 0
        for subject_object in Subject.objects.all().order_by('orderNumber'):
            self.assertEqual(response[index]['name'], subject_object.name)
            index += 1
