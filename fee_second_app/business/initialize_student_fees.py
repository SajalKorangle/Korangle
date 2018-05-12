
# Models
from fee_second_app.models import FeeDefinition

# Business
from fee_second_app.business.school_fee_component import get_school_fee_component_by_student_and_fee_defintion_object
from fee_second_app.business.student_fee_component import create_student_fee_component


def initialize_student_fees(student_object, session_object):

    # school_object = student_object.school
    school_object = student_object.parentSchool

    for fee_definition_object in FeeDefinition.objects.filter(parentSchool=school_object,
                                                              parentSession=session_object,
                                                              locked=True):

        school_fee_component_object = \
            get_school_fee_component_by_student_and_fee_defintion_object(student_object, fee_definition_object)

        create_student_fee_component(student_object, fee_definition_object, school_fee_component_object)

