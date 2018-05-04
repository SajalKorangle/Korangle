
from fee_second_app.models import FeeDefinition, SchoolFeeComponent

from fee_second_app.business.school_fee_definition import get_fee_definition_by_object
from fee_second_app.business.school_fee_component import get_school_fee_component_by_object


def get_fee_structure(data):

    fee_definition_list = []

    for fee_definition_object in FeeDefinition.objects.filter(
            parentSchool_id=data['schoolDbId'],
            parentSession_id=data['sessionDbId']).order_by('orderNumber'):

        temp_fee_definition = get_fee_definition_by_object(fee_definition_object)

        temp_fee_definition['schoolFeeComponentList'] = []

        for school_component_object in SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)\
                .order_by('title'):

            temp_school_component = get_school_fee_component_by_object(school_component_object)

            temp_fee_definition['schoolFeeComponentList'].append(temp_school_component)

        fee_definition_list.append(temp_fee_definition)

    return fee_definition_list
