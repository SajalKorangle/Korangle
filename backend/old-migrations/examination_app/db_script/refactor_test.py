
def refactor_test(apps, schema_editor):

    Test = apps.get_model('examination_app', 'Test')
    Division = apps.get_model('class_app', 'Division')

    for test_object in Test.objects.all():
        test_object.parentClass = \
            test_object.parentSection.parentClassSession.parentClass
        test_object.parentSession = \
            test_object.parentSection.parentClassSession.parentSession
        test_object.parentDivision = \
            Division.objects.get(name=test_object.parentSection.name)
        test_object.save()

