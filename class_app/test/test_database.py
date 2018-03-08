from parent_test import ParentTestCase

from class_app.models import Class, ClassSession, Section

from school_app.models import Session

class DatabaseTestCase(ParentTestCase):

    def test_class_count(self):
        self.assertEqual(Class.objects.all().count(),16)
    
    def test_class_name(self):
        
        class_list = []
        
        for class_object in Class.objects.all().order_by('orderNumber'):
            tempClass = {}
            tempClass['name'] = class_object.name
            tempClass['dbId'] = class_object.id
            class_list.append(tempClass)

        self.assertEqual(class_list[0]['name'], 'Class - 12')
        self.assertEqual(class_list[1]['name'], 'Class - 11')
        self.assertEqual(class_list[2]['name'], 'Class - 10')
        self.assertEqual(class_list[3]['name'], 'Class - 9')
        self.assertEqual(class_list[4]['name'], 'Class - 8')
        self.assertEqual(class_list[5]['name'], 'Class - 7')
        self.assertEqual(class_list[6]['name'], 'Class - 6')
        self.assertEqual(class_list[7]['name'], 'Class - 5')
        self.assertEqual(class_list[8]['name'], 'Class - 4')
        self.assertEqual(class_list[9]['name'], 'Class - 3')
        self.assertEqual(class_list[10]['name'], 'Class - 2')
        self.assertEqual(class_list[11]['name'], 'Class - 1')
        self.assertEqual(class_list[12]['name'], 'U.K.G.')
        self.assertEqual(class_list[13]['name'], 'L.K.G.')
        self.assertEqual(class_list[14]['name'], 'Nursery')
        self.assertEqual(class_list[15]['name'], 'Play Group')

    def test_section_count_and_name_per_class_per_session(self):

        for class_object in Class.objects.all():

            for session_object in Session.objects.all():
            
                section_queryset = Section.objects.filter(parentClassSession__parentClass=class_object,
                                                          parentClassSession__parentSession=session_object)

                self.assertEqual(section_queryset.count(),10)

                self.assertEqual(section_queryset[0].name, 'Section - A')
                self.assertEqual(section_queryset[1].name, 'Section - B')
                self.assertEqual(section_queryset[2].name, 'Section - C')
                self.assertEqual(section_queryset[3].name, 'Section - D')
                self.assertEqual(section_queryset[4].name, 'Section - E')
                self.assertEqual(section_queryset[5].name, 'Section - F')
                self.assertEqual(section_queryset[6].name, 'Section - G')
                self.assertEqual(section_queryset[7].name, 'Section - H')
                self.assertEqual(section_queryset[8].name, 'Section - I')
                self.assertEqual(section_queryset[9].name, 'Section - J')

    def test_one_classSession_per_section(self):
        for section_object in Section.objects.all():
            self.assertIsNotNone(section_object.parentClassSession)

    def test_one_class_per_classSession(self):
        for classSession_object in ClassSession.objects.all():
            self.assertIsNotNone(classSession_object.parentClass)

    def test_one_session_per_classSession(self):
        for classSession_object in ClassSession.objects.all():
            self.assertIsNotNone(classSession_object.parentSession)