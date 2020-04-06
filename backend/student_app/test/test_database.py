from parent_test import ParentTestCase

from school_app.model.models import Session

from student_app.models import Student

class DatabaseTestCase(ParentTestCase):

    def test_atmost_one_section_per_student_per_session_(self):
        for session_object in Session.objects.all():
            for student_object in Student.objects.all():
                self.assertLessEqual(student_object.studentsection_set
                                     .filter(parentSession=session_object).count(),1)

    '''def test_atmost_one_section_per_class(self):
        for class_object in Class.objects.all():
            for student_object in Student.objects.all():
                self.assertLessEqual(student_object.friendSection.filter(parentClassSession__parentClass=class_object).count(),1)'''

    def test_atleast_one_section_per_student(self):
        for student_object in Student.objects.all():
            # self.assertGreaterEqual(student_object.friendSection.all().count,1)
            self.assertGreaterEqual(student_object.studentsection_set.count(),1)

    def test_one_user_per_student(self):
        for student_object in Student.objects.all():
            self.assertIsNotNone(student_object.parentSchool)
