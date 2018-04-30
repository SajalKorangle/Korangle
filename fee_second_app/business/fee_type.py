
from fee_second_app.models import FeeType


def get_fee_type_list():

    fee_type_list = []

    for fee_type_object in FeeType.objects.all().order_by('name'):

        temp_fee_type_response = {}
        temp_fee_type_response['dbId'] = fee_type_object.id
        temp_fee_type_response['name'] = fee_type_object.name

        fee_type_list.append(temp_fee_type_response)

    return fee_type_list