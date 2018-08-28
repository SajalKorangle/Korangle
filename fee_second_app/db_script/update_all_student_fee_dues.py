
from student_app.models import Student

from fee_second_app.business.student_fee_dues import update_student_fee_dues


def update_all_student_fees(apps, schema_editor):

    for student_object in Student.objects.all():

        update_student_fee_dues(student_object)
