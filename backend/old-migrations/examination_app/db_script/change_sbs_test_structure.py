

from decimal import Decimal

def change_sbs_test_structure(apps, schema_editor):

    add_50_maximumMarks(apps, schema_editor)

    transform_test(apps, schema_editor, 'Class - 1', 'Computer', 'Computer', 220, 50)
    transform_test(apps, schema_editor, 'Class - 1', 'General Knowledge', 'General Knowledge', 220, 50)
    transform_test(apps, schema_editor, 'Class - 1', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'Class - 2', 'Computer', 'Computer', 220, 50)
    transform_test(apps, schema_editor, 'Class - 2', 'General Knowledge', 'General Knowledge', 220, 50)
    transform_test(apps, schema_editor, 'Class - 2', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'Class - 3', 'Computer', 'Computer', 220, 50)
    transform_test(apps, schema_editor, 'Class - 3', 'General Knowledge', 'General Knowledge', 220, 50)
    transform_test(apps, schema_editor, 'Class - 3', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'Class - 4', 'Computer', 'Computer', 220, 50)
    transform_test(apps, schema_editor, 'Class - 4', 'General Knowledge', 'General Knowledge', 220, 50)
    transform_test(apps, schema_editor, 'Class - 4', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'Class - 5', 'Computer', 'Computer', 220, 50)
    transform_test(apps, schema_editor, 'Class - 5', 'General Knowledge', 'General Knowledge', 220, 50)
    transform_test(apps, schema_editor, 'Class - 5', 'Drawing', 'Drawing', 220, 100)

    transform_test(apps, schema_editor, 'Class - 6', 'General Knowledge', 'General Knowledge', 240, 50)
    transform_test(apps, schema_editor, 'Class - 6', 'Drawing', 'Computer', 240, 50)

    transform_test(apps, schema_editor, 'Class - 7', 'General Knowledge', 'General Knowledge', 240, 50)
    transform_test(apps, schema_editor, 'Class - 7', 'Drawing', 'Computer', 240, 50)

    transform_test(apps, schema_editor, 'Class - 8', 'General Knowledge', 'General Knowledge', 240, 50)
    transform_test(apps, schema_editor, 'Class - 8', 'Drawing', 'Computer', 240, 50)


def transform_test(apps, schema_editor, initialClass, initialSubject, finalSubject, initialMarks, finalMarks):

    StudentTestResult = apps.get_model('examination_app', 'StudentTestResult')
    Test = apps.get_model('examination_app', 'Test')
    Subject = apps.get_model('subject_app', 'Subject')
    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')


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


def add_50_maximumMarks(apps, schema_editor):

    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')
    Grade = apps.get_model('examination_app', 'Grade')

    maximumMarksAllowed_object = MaximumMarksAllowed(marks=50)
    maximumMarksAllowed_object.save()

    addGrade(Grade, 50, 37.5, maximumMarksAllowed_object, 'A')
    addGrade(Grade, 37.4, 30, maximumMarksAllowed_object, 'B')
    addGrade(Grade, 29.9, 22.5, maximumMarksAllowed_object, 'C')
    addGrade(Grade, 22.4, 16.5, maximumMarksAllowed_object, 'D')
    addGrade(Grade, 16.4, 0, maximumMarksAllowed_object, 'E')


def addGrade(Grade, maxMarks, minMarks, maxMarksObject, gradeValue):
    grade_object = Grade(maximumMarks=maxMarks, minimumMarks=minMarks, parentMaximumMarksAllowed=maxMarksObject, value=gradeValue)
    grade_object.save()