from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from functools import reduce
from rest_framework import serializers
from django.db import transaction as db_transaction
from common.json_encoding import make_dict_serializable, make_dict_list_serializable

from django.db.models import Count


def get_model_serializer(Model, fields__korangle, activeSchoolId=None, activeStudentIdList=None):

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

        if attr == '__or__':
            or_filter_aggregate = ~Q()
            for or_filter in value:
                db_filter = parseFilter(or_filter)
                or_filter_aggregate = or_filter_aggregate | Q(*db_filter['filter_args'], **db_filter['filter_kwargs'])
            filter_args.append(or_filter_aggregate)
        else:
            filter_kwargs.update({attr: value})

    return {'filter_args': filter_args, 'filter_kwargs': filter_kwargs}


def parse_query(Model, data, *args, **kwargs):
    query_set = Model.Permissions().getPermittedQuerySet(*args, **kwargs)
    child_query_field_name_mapped_by_filter = {}

    field_list = ['__all__']
    if 'fields_list' in data:
        field_list = data['fields_list']
        del data['fields__korangle']
    if '__all__' in field_list:
        all_index = field_list.index('__all__')
        field_list[all_index:all_index + 1] = [field.name for field in Model._meta.concrete_fields]

    for key, value in data.items():
        if key.startswith('filter'):
            parsed_filter = parseFilter(value)
            query_set = query_set.filter(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
        elif key.startswith('exclude'):
            parsed_filter = parseFilter(value)
            query_set = query_set.exclude(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
        elif key.endsWith('__count__annotate__'):  # query format: field_name__count__annotate__ = {<filter>}
            parsed_filter = parseFilter(value)
            query_set = query_set.annotate(**{key: Count(key.removesuffix('__count__annotate__'),
                                           filter=Q(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs']))})
        elif key.endswith('__count__alias__'):
            parsed_filter = parseFilter(value)
            query_set = query_set.alias(**{key: Count(key.removesuffix('__count__alias__'), filter=Q(*
                                        parsed_filter['filter_args'], **parsed_filter['filter_kwargs']))})
        elif key in Model._meta.fields_map:
            child_query_field_name_mapped_by_filter[key] = value
        elif key in ['order_by', 'pagination']:
            pass
        else:
            raise Exception('Invalid key in GET object Query')
    return query_set, child_query_field_name_mapped_by_filter, field_list


def get_object(data, Model, *args, **kwargs):
    query_set, child_query_field_name_mapped_by_filter, field_list = parse_query(Model, data, *args, **kwargs)

    try:
        object = query_set.values(*field_list).get()
    except ObjectDoesNotExist:
        return None
    return_data = make_dict_serializable(object)

    for key in child_query_field_name_mapped_by_filter.keys():
        child_query_field_name_mapped_by_filter[key].update({   # added parent<Model> filter
            'filter__child_query__': {
                Model._meta.fields_map[key].field.name: return_data[Model._meta.pk.name]
            }
        })
        return_data[key] = get_list(child_query_field_name_mapped_by_filter[key], Model._meta.fields_map[key].related_model, *args, **kwargs)

    return return_data


def get_list(data, Model, *args, **kwargs):
    query_set, child_query_field_name_mapped_by_filter, field_list = parse_query(Model, data, *args, **kwargs)

    if 'order_by' in data:
        query_set = query_set.order_by(*data['order_by'])
    if 'pagination' in data:
        query_set = query_set[data['pagination']['start']:data['pagination']['end']]

    return_data = query_set.values(*field_list)
    return_data = make_dict_list_serializable(return_data)

    id_list = [getattr(instance, Model._meta.pk.name) for instance in query_set]

    for key in child_query_field_name_mapped_by_filter.keys():
        child_order_by = child_query_field_name_mapped_by_filter.get('order_by', [])
        child_query_field_name_mapped_by_filter[key].update({   # added parent<Model> filter
            'filter__child_query__': {
                Model._meta.fields_map[key].field.name + "__in": id_list
            },
            'order_by': [Model._meta.fields_map[key].field.name] + child_order_by
        })
        aggregated_child_data_list = get_list(child_query_field_name_mapped_by_filter[key], Model._meta.fields_map[key].related_model, *args, **kwargs)
        child_data_list_mapped_by_foreign_key = {}
        for instance in query_set:
            child_data_list_mapped_by_foreign_key[getattr(instance, Model._meta.pk.name)] = []
        for child_data in aggregated_child_data_list:
            child_data_list_mapped_by_foreign_key[child_data[Model._meta.fields_map[key].field.name]].append(child_data)
        for index, instance in enumerate(query_set):
            return_data[index][key] = child_data_list_mapped_by_foreign_key[getattr(instance, Model._meta.pk.name)]

    return return_data


def create_object_list(data_list, Model, activeSchoolId, activeStudentIdList):
    response = []
    with db_transaction.atomic():
        for data in data_list:
            response.append(create_object(data, Model, activeSchoolId, activeStudentIdList))
    return response


def create_object(data, Model, activeSchoolId, activeStudentIdList):
    data_list_mapped_by_child_related_field_name = {}

    for child_related_field_name in [field_name for field_name in data.keys() if field_name.endswith('List')]:
        data_list_mapped_by_child_related_field_name[child_related_field_name] = data[child_related_field_name]
        del data[child_related_field_name]

    with db_transaction.atomic():
        ModelSerializer = get_model_serializer(Model=Model, fields__korangle=None, activeSchoolId=activeSchoolId, activeStudentIdList=activeStudentIdList)
        serializer = ModelSerializer(data=data)
        assert serializer.is_valid(), "{0}\n data = {1}".format(serializer.errors, data)
        serializer.save()
        response = serializer.data

        for child_related_field_name, child_data_list in data_list_mapped_by_child_related_field_name.items():
            # removing list from end and finding the related model field
            child_related_field = Model._meta.fields_map.get(child_related_field_name, None)
            if not child_related_field:
                raise Exception('Invalid Field Name for Related Fields: {0} '.format(child_related_field_name))  # verbose message for debugging

            child_model = child_related_field.related_model

            parent_primary_key_value = response[Model._meta.pk.name]
            for child_data in child_data_list:
                child_data.update({child_related_field.remote_field.name: parent_primary_key_value})

            child_response = create_object_list(child_data_list, child_model, activeSchoolId, activeStudentIdList)

            response.update({child_related_field_name: child_response})
    return response


# def update_list(data_list, Model, activeSchoolId, activeStudentIdList):
#     return_data = []
#     for data in data_list:
#         return_data.append(update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID))
#     return return_data


# def update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID):
#     serializer = ModelSerializer(query_set.get(id=data['id']), data=data)
#     assert serializer.is_valid(activeSchoolID=activeSchoolID, activeStudentID=activeStudentID)
#     serializer.save()
#     return serializer.data


# def partial_update_list(data_list, query_set, ModelSerializer, activeSchoolID, activeStudentID):
#     return_data = []
#     for data in data_list:
#         return_data.append(partial_update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID))
#     return return_data


# def partial_update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID):
#     serializer = ModelSerializer(query_set.get(id=data['id']), data=data, partial=True)
#     assert serializer.is_valid(activeSchoolID=activeSchoolID, activeStudentID=activeStudentID)
#     serializer.save()
#     return serializer.data


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
