from parent_test import ParentTestCase

from examination_app.handlers.maximumMarksAllowed import get_maximumMarksAllowed

from examination_app.models import MaximumMarksAllowed

class MaximumMarksAllowedTestCase(ParentTestCase):

    def test_get_maximumMarksAllowed(self):

        response = get_maximumMarksAllowed()

        self.assertEqual(len(response), MaximumMarksAllowed.objects.count())

        index = 0
        for marks_object in MaximumMarksAllowed.objects.all():

            self.assertEqual(marks_object.marks, response[index]['marks'])
            self.assertEqual(marks_object.id, response[index]['dbId'])

            index += 1
