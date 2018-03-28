from parent_test import ParentTestCase

from class_app.handlers.new_student import get_class_section_list

from school_app.model.models import Session

class NewStudentTestCase(ParentTestCase):

    def test_new_student(self):

        for session_object in Session.objects.all():

            data = {}
            data['sessionDbId'] = session_object.id

            class_section_list = get_class_section_list(data)

            self.assertEqual(len(class_section_list),16)

            self.assertEqual(class_section_list[0]['name'], 'Class - 12')
            self.assertEqual(class_section_list[1]['name'], 'Class - 11')
            self.assertEqual(class_section_list[2]['name'], 'Class - 10')
            self.assertEqual(class_section_list[3]['name'], 'Class - 9')
            self.assertEqual(class_section_list[4]['name'], 'Class - 8')
            self.assertEqual(class_section_list[5]['name'], 'Class - 7')
            self.assertEqual(class_section_list[6]['name'], 'Class - 6')
            self.assertEqual(class_section_list[7]['name'], 'Class - 5')
            self.assertEqual(class_section_list[8]['name'], 'Class - 4')
            self.assertEqual(class_section_list[9]['name'], 'Class - 3')
            self.assertEqual(class_section_list[10]['name'], 'Class - 2')
            self.assertEqual(class_section_list[11]['name'], 'Class - 1')
            self.assertEqual(class_section_list[12]['name'], 'U.K.G.')
            self.assertEqual(class_section_list[13]['name'], 'L.K.G.')
            self.assertEqual(class_section_list[14]['name'], 'Nursery')
            self.assertEqual(class_section_list[15]['name'], 'Play Group')

            for tempClass in class_section_list:
                self.assertEqual(len(tempClass['sectionList']),10)

                self.assertEqual(tempClass['sectionList'][0]['name'], 'Section - A')
                self.assertEqual(tempClass['sectionList'][1]['name'], 'Section - B')
                self.assertEqual(tempClass['sectionList'][2]['name'], 'Section - C')
                self.assertEqual(tempClass['sectionList'][3]['name'], 'Section - D')
                self.assertEqual(tempClass['sectionList'][4]['name'], 'Section - E')
                self.assertEqual(tempClass['sectionList'][5]['name'], 'Section - F')
                self.assertEqual(tempClass['sectionList'][6]['name'], 'Section - G')
                self.assertEqual(tempClass['sectionList'][7]['name'], 'Section - H')
                self.assertEqual(tempClass['sectionList'][8]['name'], 'Section - I')
                self.assertEqual(tempClass['sectionList'][9]['name'], 'Section - J')
