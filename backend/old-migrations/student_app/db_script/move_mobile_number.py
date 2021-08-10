
def move_mobile_number(apps, schema_editor):

    move_mobile_number_for_school(apps, 'Magadham Int.')
    move_mobile_number_for_school(apps, 'Magadham Pre')


def move_mobile_number_for_school(apps, school_name):

    Student = apps.get_model('student_app', 'Student')
    count = 0
    exceptionCount = 0
    student_query_set = Student.objects.filter(parentSchool__name=school_name)
    for student_object in student_query_set:
        try:
            alternate_mobile_number = int(student_object.remark)
            if 9999999999 > alternate_mobile_number > 1000000000:
                student_object.secondMobileNumber = alternate_mobile_number
                student_object.remark = None
                student_object.save()
                print(str(student_object.secondMobileNumber))
                count += 1
        except Exception as ex:
            exceptionCount += 1
            continue

    print('Total Students: ' + str(student_query_set.count()))
    print('Conversion: ' + str(count))
    print('Exception Count: ' + str(exceptionCount))