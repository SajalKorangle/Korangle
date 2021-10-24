from django.db.models import Q
from rest_framework import serializers
from django.db.models.fields.related import ForeignKey
from django.db import transaction as db_transaction
from common.json_encoding import make_dict_list_serializable

from django.db.models import Count


AGGREGATOR_FUNCTION_MAPPED_BY_NAME = {
    'Count': Count,
}


def get_default_filter():
    return {'filter_args': [], 'filter_kwargs': {}}


def get_model_serializer(Model, fields__korangle=None, activeSchoolId=None, activeStudentIdList=None):

    class ModelSerializer(serializers.ModelSerializer):

        def is_valid(self, *args, **kwargs):

            super_response = super().is_valid(raise_exception=False)
            if not super_response:
                return False

            return self.Meta.model.Permissions().is_valid(self.validated_data, activeSchoolId, activeStudentIdList)

        class Meta:
            model = Model
            fields = '__all__' if fields__korangle is None else fields__korangle

    return ModelSerializer


def parseFilter(data):
    filter_kwargs = {}
    filter_args = []
    for attr, value in data.items():

        if attr == '__or__':  # __or__: [{<filter1>}, {<filter2>}, ...]
            or_filter_aggregate = ~Q()
            for or_filter in value:
                db_filter = parseFilter(or_filter)
                or_filter_aggregate = or_filter_aggregate | Q(*db_filter['filter_args'], **db_filter['filter_kwargs'])
            filter_args.append(or_filter_aggregate)
        else:
            filter_kwargs.update({attr: value})  # filters like id__in, parentSession etc.

    return {'filter_args': filter_args, 'filter_kwargs': filter_kwargs}


def parse_query(Model, data, *args, **kwargs):
    query = Model.objects.filter(Model.Permissions().getPermittedQuerySet(*args, **kwargs))

    for key, value in data.items():
        if key == 'filter':
            parsed_filter = parseFilter(value)
            query = query.filter(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
        elif key == 'exclude':
            parsed_filter = parseFilter(value)
            query = query.exclude(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
        elif key == 'annotate':
            for alias_name, alias_generator_data in value.items():
                parsed_filter = parseFilter(alias_generator_data['filter']) if 'filter' in alias_generator_data else get_default_filter()
                alias_field_name = alias_generator_data['field']
                alias_function = AGGREGATOR_FUNCTION_MAPPED_BY_NAME[alias_generator_data['function']]
                query = query.annotate(**{alias_name: alias_function(alias_field_name, filter=Q(*
                                                                                                parsed_filter['filter_args'], **parsed_filter['filter_kwargs']))})
        elif key in ['order_by', 'pagination']:
            pass
        else:
            raise Exception('Invalid key in GET object Query')

    if 'order_by' in data:
        query = query.order_by(*data['order_by'])
    if 'pagination' in data:
        query = query[data['pagination']['start']:data['pagination']['end']]

    return query


def get_object(data, Model, *args, **kwargs):
    list_response = get_object_list(data, Model, *args, **kwargs)
    if(len(list_response) == 0):
        return None
    elif len(list_response) > 1:
        raise Exception('Multiple objects found for get_object')
    return list_response[0]


def get_object_list(data, Model, *args, **kwargs):

    child_field_name_mapped_by_query = {}
    parent_field_name_mapped_by_query = {}

    ## Response Structure(fields_list) Processing Starts ##
    field_list = ['__all__']
    processed_field_list: list[str] = []
    if 'fields_list' in data:
        field_list = data['fields_list']
        del data['fields_list']

    for field_data in field_list:
        if field_data == '__all__':  # all model fields
            processed_field_list += [field.name for field in Model._meta.concrete_fields]  # Replacing __all__ with concrete fields
        elif type(field_data) == str:  # string represents one model field
            processed_field_list.append(field_data)
        elif type(field_data) == dict:  # parent/child nested field
            if field_data['name'] in Model._meta.fields_map:
                child_field_name_mapped_by_query[field_data['name']] = field_data.get('query', {})
                field_list.append(field_data['name'])  # Ensuring this foreign key in .values for later regrouping
            elif type(Model._meta.get_field(field_data['name'])) == ForeignKey:
                parent_field_name_mapped_by_query[field_data['name']] = field_data.get('query', {})
            else:
                raise Exception('Invalid parent/child data dict in GET Query')
        else:
            raise Exception('Invalid field_list data in GET Query')
    ## Response Structure(fields_list) Processing Ends ##

    query_set = parse_query(Model, data, *args, **kwargs)

    pk_field_name = Model._meta.pk.name
    processed_field_list.append(pk_field_name)  # ensuring pk field is always included, duplicates are allowed

    return_data = list(query_set.values(*processed_field_list))
    return_data = make_dict_list_serializable(return_data)  # making json serializable

    id_list = [instance_data[pk_field_name] for instance_data in return_data]

    ## Child Nested Data Query Starts ##
    for key, value in child_field_name_mapped_by_query.items():
        child_field_name = Model._meta.fields_map[key].field.name
        child_model = Model._meta.fields_map[key].related_model
        value.update({   # added parent<Model> filter
            'filter': dict(value.get('filter', {}), **{
                child_field_name + "__in": id_list
            })
        })

        aggregated_child_data_list = get_object_list(child_field_name_mapped_by_query[key], child_model, *args, **kwargs)

        ## Regrouping starts ##
        child_data_list_mapped_by_foreign_key = {}  # Grouping by parentModel.pk
        for instance in query_set:
            child_data_list_mapped_by_foreign_key[getattr(instance, pk_field_name)] = []     # Initialization
        for child_data in aggregated_child_data_list:
            child_data_list_mapped_by_foreign_key[child_data[child_field_name]].append(child_data)  # adding to corresponding group
        for index, instance in enumerate(query_set):
            return_data[index][key] = child_data_list_mapped_by_foreign_key[getattr(instance, pk_field_name)]
        ## Regrouping ends ##
    ## Child Nested Data Query Ends ##

    ## Parent Nested Data Query Starts ##
    for key, value in parent_field_name_mapped_by_query.items():
        ## Initialization for Parent Model Nesting Starts ##
        parent_model = Model._meta.get_field(key).related_model
        parent_model_pk_field_name = parent_model._meta.pk.name
        parent_pk_list = [instance_data[key] for instance_data in return_data if instance_data[key] is not None]
        ## Initialization for Parent Model Nesting Ends ##

        value.update({  # Updating Filter
            'filter': dict(value.get('filter', {}), **{
                parent_model_pk_field_name + '__in': parent_pk_list
            })
        })

        ## Ensuring parent<model> field is added in fields_list for later regrouping Starts ##
        if 'field_list' in value:
            value['field_list'].append(parent_model_pk_field_name)
        ## Ensuring parent<model> field is added in fields_list for later regrouping Ends ##

        aggregated_parent_data_list = get_object_list(value, parent_model, *args, **kwargs)

        ## Regrouping Starts ##
        parent_data_mapped_by_pk = {}
        for data in aggregated_parent_data_list:
            parent_data_mapped_by_pk[data[parent_model_pk_field_name]] = data
        for data in return_data:
            if data[key] is not None:
                data[key] = parent_data_mapped_by_pk[data[key]]
        ## Regrouping Ends ##
    ## Parent Nested Data Query Ends ##

    # Total No of DB Queries = 1 + No of child Queries + No of parent Queries

    return return_data


def operate_list(data_list, Model, activeSchoolId, activeStudentIdList, operation_function):
    response = []
    with db_transaction.atomic():
        for data in data_list:
            response.append(operate_object(data, Model, activeSchoolId, activeStudentIdList, operation_function))
    return response


def operate_object(data, Model, activeSchoolId, activeStudentIdList, operation_function):
    data_list_mapped_by_child_related_field_name = {}

    for child_related_field_name in [field_name for field_name in data.keys() if field_name.endswith('List')]:
        data_list_mapped_by_child_related_field_name[child_related_field_name] = data[child_related_field_name]
        del data[child_related_field_name]

    with db_transaction.atomic():
        response = operation_function(data, Model, activeSchoolId, activeStudentIdList)
        for child_related_field_name, child_data_list in data_list_mapped_by_child_related_field_name.items():
            # removing list from end and finding the related model field
            child_related_field = Model._meta.fields_map.get(child_related_field_name, None)
            if not child_related_field:
                raise Exception('Invalid Field Name for Related Fields: {0} '.format(child_related_field_name))  # verbose message for debugging

            child_model = child_related_field.related_model

            parent_primary_key_value = response[Model._meta.pk.name]
            for child_data in child_data_list:
                child_data.update({child_related_field.remote_field.name: parent_primary_key_value})

            child_response = operate_list(child_data_list, child_model, activeSchoolId, activeStudentIdList, operation_function)

            response.update({child_related_field_name: child_response})
    return response


def create_object_operation(data, Model, activeSchoolId, activeStudentIdList):
    ModelSerializer = get_model_serializer(Model=Model, activeSchoolId=activeSchoolId, activeStudentIdList=activeStudentIdList)
    serializer = ModelSerializer(data=data)
    assert serializer.is_valid(), "{0}\n data = {1}".format(serializer.errors, data)
    serializer.save()
    return serializer.data


def create_object_list(data_list, Model, activeSchoolId, activeStudentIdList):
    return operate_list(data_list, Model, activeSchoolId, activeStudentIdList, create_object_operation)


def create_object(data, Model, activeSchoolId, activeStudentIdList):
    return operate_object(data, Model, activeSchoolId, activeStudentIdList, create_object_operation)


def get_update_object_operation(partial: bool):
    def update_object_operation(data, Model, activeSchoolId, activeStudentIdList):
        permitted_query_set = Model.objects.filter(Model.Permissions().getPermittedQuerySet(activeSchoolId, activeStudentIdList))
        main_model_pk_field_name = Model._meta.pk.name

        ModelSerializer = get_model_serializer(Model=Model, activeSchoolId=activeSchoolId, activeStudentIdList=activeStudentIdList)
        serializer = ModelSerializer(permitted_query_set.get(**{main_model_pk_field_name: data[main_model_pk_field_name]}), data=data, partial=partial)
        assert serializer.is_valid(), "{0}\n data = {1}".format(serializer.errors, data)
        serializer.save()
        return serializer.data
    return update_object_operation


def update_object_list(data_list, Model, activeSchoolId, activeStudentIdList, partial=False):
    return operate_list(data_list, Model, activeSchoolId, activeStudentIdList, get_update_object_operation(partial))


def update_object(data, Model, activeSchoolId, activeStudentIdList, partial=False):
    return operate_object(data, Model, activeSchoolId, activeStudentIdList, get_update_object_operation(partial))


# def delete_object(GET, Model, activeSchoolId, activeStudentIdList):
#     data = GET.dict()
#     query_set = permittedQuerySet(Model, activeSchoolId,  activeStudentIdList)

#     try:
#         object = query_set.get(**data)
#     except ObjectDoesNotExist:
#         return None
#     id = object.id
#     object.delete()
#     return id


# def delete_list(data, query_set):

#     filter_var_list = []
#     filter_var = ''

#     if data != '' and data is not None:
#         for index, attr in enumerate(data):

#             if attr == 'e':
#                 continue
#             elif attr[-4:] == '__in':
#                 if data[attr] != '':
#                     filter_var = {attr: list(map(int, data[attr].split(',')))}
#                 else:
#                     filter_var = {attr: []}
#             elif attr[-4:] == '__or':
#                 filter_var = {attr[:-4]: data[attr]}
#                 filter_var_list.append(filter_var)
#                 continue
#             else:
#                 if data[attr] == 'null__korangle':
#                     filter_var = {attr: None}
#                 elif data[attr] == 'false__boolean':
#                     filter_var = {attr: False}
#                 elif data[attr] == 'true__boolean':
#                     filter_var = {attr: True}
#                 else:
#                     filter_var = {attr: data[attr]}

#             if filter_var_list.__len__() > 0:
#                 filter_var_list.append(filter_var)
#                 q_total = Q()
#                 for q_variable in filter_var_list:
#                     q_total = q_total | Q(**q_variable)
#                 try:
#                     query_set = query_set.filter(q_total)
#                 except:
#                     print('filter exception in or:')
#                     print(filter_var_list)
#                 filter_var_list = []
#             else:
#                 try:
#                     query_set = query_set.filter(**filter_var)
#                 except:
#                     print('filter exception:')
#                     print(filter_var)

#     return_data = query_set.count()

#     if return_data > 0:
#         query_set.delete()

#     return return_data
