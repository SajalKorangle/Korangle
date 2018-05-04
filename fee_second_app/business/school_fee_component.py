
from fee_second_app.models import ClassBasedFilter, BusStopBasedFilter, FeeDefinition, SchoolMonthlyFeeComponent

def get_school_fee_component_by_object(school_component_object):

    school_component_response = {}

    school_component_response['dbId'] = school_component_object.id
    school_component_response['feeDefinitionDbId'] = school_component_object.parentFeeDefinition.id
    school_component_response['title'] = school_component_object.title
    school_component_response['amount'] = school_component_object.amount


    if school_component_object.parentFeeDefinition.classFilter:

        school_component_response['classList'] = []

        for class_based_filter_object in ClassBasedFilter.objects.filter(parentSchoolFeeComponent=school_component_object)\
                .order_by('parentClass__orderNumber'):

            class_response = {}
            class_response['name'] = class_based_filter_object.parentClass.name
            class_response['dbId'] = class_based_filter_object.parentClass.id

            school_component_response['classList'].append(class_response)

    if school_component_object.parentFeeDefinition.busStopFilter:

        school_component_response['busStopList'] = []

        for bus_stop_based_filter_object in BusStopBasedFilter.objects.filter(parentSchoolFeeComponent=school_component_object) \
                .order_by('parentBusStop__kmDistance'):
            bus_stop_response = {}
            bus_stop_response['stopName'] = bus_stop_based_filter_object.parentBusStop.stopName
            bus_stop_response['dbId'] = bus_stop_based_filter_object.parentBusStop.id

            school_component_response['busStopList'].append(bus_stop_response)

    if school_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

        school_component_response['monthList'] = []

        for school_monthly_fee_component_object in SchoolMonthlyFeeComponent.objects.filter(
                parentSchoolFeeComponent=school_component_object).order_by('parentMonth__orderNumber'):

            month_response = {}
            month_response['month'] = school_monthly_fee_component_object.parentMonth.name
            month_response['amount'] = school_monthly_fee_component_object.amount

            school_component_response['monthList'].append(month_response)

    return school_component_response

