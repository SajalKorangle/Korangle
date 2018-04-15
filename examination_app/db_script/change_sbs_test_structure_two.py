

from decimal import Decimal

def change_sbs_test_structure(apps, schema_editor):

    transform_test(apps, schema_editor, 'Nursery', 'EVS/Science', None, 220, 0)
    transform_test(apps, schema_editor, 'Nursery', 'Moral Science', None, 220, 0)
    transform_test(apps, schema_editor, 'Nursery', 'General Knowledge', None, 220, 0)
    transform_test(apps, schema_editor, 'Nursery', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'L.K.G.', 'EVS/Science', None, 220, 0)
    transform_test(apps, schema_editor, 'L.K.G.', 'Moral Science', None, 220, 0)
    transform_test(apps, schema_editor, 'L.K.G.', 'General Knowledge', None, 220, 0)
    transform_test(apps, schema_editor, 'L.K.G.', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'U.K.G.', 'EVS/Science', None, 220, 0)
    transform_test(apps, schema_editor, 'U.K.G.', 'Moral Science', None, 220, 0)
    transform_test(apps, schema_editor, 'U.K.G.', 'General Knowledge', None, 220, 0)
    transform_test(apps, schema_editor, 'U.K.G.', 'Drawing', 'Drawing', 220, 100)


def transform_test(apps, schema_editor, initialClass, initialSubject, finalSubject, initialMarks, finalMarks):

    StudentTestResult = apps.get_model('examination_app', 'StudentTestResult')
    Test = apps.get_model('examination_app', 'Test')
    Subject = apps.get_model('subject_app', 'Subject')
    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')

    if finalSubject is None:
        StudentTestResult.objects.filter(parentTest__parentSection__parentClassSession__parentClass__name=initialClass,
                                        parentTest__parentSubject__name=initialSubject,
                                        parentTest__parentSchool__name='SBS').delete()
        Test.objects.filter(parentSection__parentClassSession__parentClass__name=initialClass,
                            parentSubject__name=initialSubject,
                            parentSchool__name='SBS').delete()
    else:
        for test_object in Test.objects.filter(parentSection__parentClassSession__parentClass__name=initialClass,
                                               parentSubject__name=initialSubject,
                                               parentSchool__name='SBS'):
            for student_test_result_object in StudentTestResult.objects.filter(parentTest=test_object):
                student_test_result_object.marksObtained = (student_test_result_object.marksObtained) * (Decimal(finalMarks) / Decimal(100.0))
                student_test_result_object.save()
            if initialSubject != finalSubject:
                test_object.parentSubject = Subject.objects.get(name=finalSubject, governmentSubject=False)
            if initialMarks != finalMarks:
                test_object.parentMaximumMarks = MaximumMarksAllowed.objects.get(marks=finalMarks)
            test_object.save()
