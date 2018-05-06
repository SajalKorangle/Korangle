
from fee_second_app.models import ClassBasedFilter, BusStopBasedFilter, FeeDefinition, \
    SchoolMonthlyFeeComponent, SchoolFeeComponent, Month


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


def create_school_fee_component(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['feeDefinitionDbId'])

    school_fee_component_object = SchoolFeeComponent(parentFeeDefinition=fee_definition_object,title=data['title'])

    if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
        school_fee_component_object.amount = data['amount']

    school_fee_component_object.save()

    if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
        for month_data in data['monthList']:
            month_object = Month.objects.get(name=month_data['month'])
            school_monthly_fee_component_object = SchoolMonthlyFeeComponent(parentSchoolFeeComponent=school_fee_component_object,
                                                                            parentMonth=month_object,
                                                                            amount=month_data['amount'])
            school_monthly_fee_component_object.save()

    # classDbIdList = []
    if fee_definition_object.classFilter:
        for class_data in data['classList']:
            # classDbIdList.append(class_data['dbId'])
            class_based_filter_object = ClassBasedFilter(parentSchoolFeeComponent=school_fee_component_object,
                                                         parentClass_id=class_data['dbId'])
            class_based_filter_object.save()

    # busStopDbIdList = []
    if fee_definition_object.busStopFilter:
        for bus_stop_data in data['busStopList']:
            # busStopDbIdList.append(bus_stop_data['dbId'])
            bus_stop_based_filter_object = BusStopBasedFilter(parentSchoolFeeComponent=school_fee_component_object,
                                                              parentBusStop_id=bus_stop_data['dbId'])
            bus_stop_based_filter_object.save()

    return get_school_fee_component_by_object(school_fee_component_object)


def update_school_fee_component(data):

    school_fee_component_object = SchoolFeeComponent.objects.get(id=data['dbId'])

    if school_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.YEARLY_FREQUENCY:
        school_fee_component_object.title = data['title']
        school_fee_component_object.amount = data['amount']
        school_fee_component_object.save()
    elif school_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:
        school_fee_component_object.title = data['title']
        school_fee_component_object.save()
        for month_data in data['monthList']:
            school_monthly_fee_component_object = \
                SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,
                                                      parentMonth__name=month_data['month'])
            school_monthly_fee_component_object.amount = month_data['amount']
            school_monthly_fee_component_object.save()

    return get_school_fee_component_by_object(school_fee_component_object)


def delete_school_fee_component(data):

    school_fee_component_object = SchoolFeeComponent.objects.get(id=data['dbId'])

    if school_fee_component_object.parentFeeDefinition.classFilter:
        ClassBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object).delete()

    if school_fee_component_object.parentFeeDefinition.busStopFilter:
        BusStopBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object).delete()

    if school_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:
        SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent=school_fee_component_object).delete()

    school_fee_component_object.delete()

    return {'dbId': int(data['dbId'])}
