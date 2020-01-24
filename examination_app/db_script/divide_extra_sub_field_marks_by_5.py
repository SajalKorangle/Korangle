
def divide_extra_sub_field_marks_by_5(apps, schema_editor):

    StudentExtraSubField = apps.get_model('examination_app', 'StudentExtraSubField')

    for student_extra_sub_field_object in StudentExtraSubField.objects.all():

        student_extra_sub_field_object.marksObtained = student_extra_sub_field_object.marksObtained/5
        student_extra_sub_field_object.save()

