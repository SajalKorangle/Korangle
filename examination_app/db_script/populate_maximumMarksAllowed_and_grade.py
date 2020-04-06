
from examination_app.db_script.constants import initialize_maxMarks_and_grades, initialize_maxMarks_order

def populate_maximumMarksAllowed_and_grade(apps, schema_editor):

    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')
    Grade = apps.get_model('examination_app', 'Grade')

    for maximum_marks in initialize_maxMarks_and_grades:

        maximum_marks_allowed_object = MaximumMarksAllowed(marks=maximum_marks['marks'],orderNumber=get_order_number(maximum_marks['marks']))
        maximum_marks_allowed_object.save()

        for grade in maximum_marks['grades']:

            grade_object = Grade(parentMaximumMarksAllowed=maximum_marks_allowed_object,
                                 maximumMarks=grade['maximumMarks'],
                                 minimumMarks=grade['minimumMarks'],
                                 value=grade['value'])
            grade_object.save()


def get_order_number(maximumMarks):

    for marks in initialize_maxMarks_order:
        if marks['marks'] == maximumMarks:
            return marks['orderNumber']

    return None