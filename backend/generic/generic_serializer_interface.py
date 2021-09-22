
# from django.db.models import Q
# from django.core.exceptions import ObjectDoesNotExist

from functools import reduce
from rest_framework import serializers
from django.db import transaction as db_transaction


def get_model_serializer(Model, fields__korangle, activeSchoolId=None, activeStudentIdList=None):

    class ModelSerializer(serializers.ModelSerializer):

        def is_valid(self, raise_exception=True):
            super_response = super().is_valid(raise_exception=raise_exception)
            if not super_response:
                return False

            RelationsToStudent = self.Meta.model.RelationsToStudent
            RelationsToSchool = self.Meta.model.RelationsToSchool

            # Checking for Parent
            if(activeStudentIdList):
                for relation in RelationsToStudent:
                    splitted_relation = relation.split('__')
                    parent_instance = self.validated_data.get(splitted_relation[0], None)
                    if parent_instance is not None:
                        if not (reduce(lambda instance, parent_field: getattr(instance, parent_field), splitted_relation[1:], parent_instance) in activeStudentIdList):
                            return False

            # Checking for Parent & Employee Both
            for relation in RelationsToSchool:
                splitted_relation = relation.split('__')
                parent_instance = self.validated_data.get(splitted_relation[0], None)
                if parent_instance is not None:
                    if (reduce(lambda instance, parent_field: getattr(instance, parent_field), splitted_relation[1:], parent_instance) != activeSchoolId):
                        return False

            return True

        class Meta:
            model = Model
            fields = '__all__' if fields__korangle is None else fields__korangle

    return ModelSerializer


# def permittedQuerySet(model, activeStudentIdList, activeSchoolId):
#     query_filters = {}

#     RelationsToStudent = model.RelationsToStudent
#     RelationsToSchool = model.RelationsToSchool

#     # Here we are banking on the fact that
#     # 1. if RelationsToStudent exist then RelationsToSchool always exist,
#     # 2. activeStudentId represents parent, non existence of activeStudentId & existence of activeSchoolId represents employee, nothing represent simple user.

#     if (activeStudentIdList and len(RelationsToStudent) > 0):  # for parent only, activeStudentID can be a list of studentId's
#         query_filters[RelationsToStudent[0]+'__in'] = activeStudentIdList     # takes the first relation to student only(should be the closest)
#     elif (len(RelationsToSchool) > 0):
#         query_filters[RelationsToSchool[0]] = activeSchoolId    # takes the first relation to school only(should be the the closest)
#     return model.objects.filter(**query_filters)


# def get_object(GET, Model, activeSchoolId, activeStudentIdList):
#     data = GET.dict()
#     query_set = permittedQuerySet(Model, activeSchoolId, activeStudentIdList)
#     ModelSerializer = get_model_serializer(Model=Model, fields__korangle=data.get('fields__korangle', None),
#                                            activeStudentIdList=activeStudentIdList, activeSchoolId=activeSchoolId)
#     if 'fields__korangle' in data:
#         del data['fields__korangle']

#     try:
#         object = query_set.get(**data)
#     except ObjectDoesNotExist:
#         return None
#     return ModelSerializer(object).data


# def get_list(data, Model, activeSchoolId, activeStudentIdList):
#     query_set = permittedQuerySet(Model, activeSchoolId, activeStudentIdList)

#     filter_var_list = []
#     filter_var = ''
#     order_var = ''
#     count_var = ''

#     if data != '' and data is not None:
#         for index, attr in enumerate(data):

#             if attr == 'e' or attr == 'fields__korangle':
#                 continue
#             elif attr[:15] == 'korangle__order':
#                 order_var = ''
#             elif attr == 'korangle__count':
#                 count_var = ''
#             elif attr[-4:] == '__in':
#                 if data[attr] != '':
#                     filter_var = {attr: list(data[attr].split(','))}
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
#             elif attr[:15] == 'korangle__order':
#                 try:
#                     query_set = query_set.order_by(data[attr])
#                 except:
#                     print('order exception:')
#                     print(data[attr])
#             elif attr == 'korangle__count':
#                 try:
#                     count_array = list(map(int, data[attr].split(',')))
#                     query_set = query_set[count_array[0]:count_array[1]]
#                 except:
#                     print('count exception: ')
#                     print(data[attr])
#             else:
#                 try:
#                     query_set = query_set.filter(**filter_var)
#                 except:
#                     print('filter exception:')
#                     print(filter_var)

#     ModelSerializer = get_model_serializer(Model=Model, fields__korangle=data.get('fields__korangle', None),
#                                            activeStudentIdList=activeStudentIdList, activeSchoolId=activeSchoolId)
#     return_data = ModelSerializer(query_set, many=True).data

#     return return_data


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
        ModelSerializer = get_model_serializer(Model=Model, fields__korangle=None, activeStudentIdList=activeStudentIdList, activeSchoolId=activeSchoolId)
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
