
from fee_second_app.models import FeeDefinition


def add_fee_definition(data):

    fee_definition_object = FeeDefinition(parentSchool_id=data['schoolDbId'],
                                          parentSession_id=data['sessionDbId'],
                                          parentFeeType_id=data['feeTypeDbId'],
                                          orderNumber=1,
                                          rteAllowed=data['rteAllowed'],
                                          filterType=data['filterType'],
                                          frequency=data['frequency'])
    fee_definition_object.save()

    return ''


def get_fee_definition_list_by_school_id(data):

    return ''
