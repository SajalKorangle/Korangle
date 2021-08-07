
def initialize_test(apps, schema_editor):

    StudentTest = apps.get_model('examination_app', 'StudentTest')
    TestSecond = apps.get_model('examination_app', 'TestSecond')
    StudentSection = apps.get_model('student_app', 'StudentSection')
    StudentSubject = apps.get_model('subject_app', 'StudentSubject')

    for test_second_object in TestSecond.objects.all():

        for student_section_object in \
            StudentSection.objects.filter(parentStudent__parentSchool=test_second_object.parentExamination.parentSchool,
                                          parentClass=test_second_object.parentClass,
                                          parentDivision=test_second_object.parentDivision,
                                          parentSession=test_second_object.parentExamination.parentSession):

            if StudentSubject.objects.filter(parentSubject=test_second_object.parentSubject,
                                             parentStudent=student_section_object.parentStudent).count() > 0:

                student_test = StudentTest(parentStudent=student_section_object.parentStudent,
                                           parentExamination=test_second_object.parentExamination,
                                           parentSubject=test_second_object.parentSubject,
                                           marksObtained=0,
                                           testType=test_second_object.testType)
                student_test.save()
