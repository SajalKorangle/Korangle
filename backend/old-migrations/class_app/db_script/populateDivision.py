
def populateDivision(apps, schema_editor):

    Division = apps.get_model('class_app', 'Division')

    division_array = [
        'Section - A',
        'Section - B',
        'Section - C',
        'Section - D',
        'Section - E',
        'Section - F',
        'Section - G',
        'Section - H',
        'Section - I',
        'Section - J',
    ]

    count = 1
    for division_value in division_array:
        division_object = Division(name=division_value, orderNumber=count)
        division_object.save()
        count += 1

