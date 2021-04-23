
import json

from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist


def get_object(data, query_set, ModelSerializer):
    try:
        object = query_set.get(**data.dict())
    except ObjectDoesNotExist:
        return None
    return ModelSerializer(object).data


def get_list(data, query_set, ModelSerializer):

    filter_var_list = []
    filter_var = ''
    order_var = ''
    count_var = ''

    if data != '' and data is not None:
        for index, attr in enumerate(data):

            if attr == 'e' or attr == 'fields__korangle':
                continue
            elif attr[:15] == 'korangle__order':
                order_var = ''
            elif attr == 'korangle__count':
                count_var = ''
            elif attr[-4:] == '__in':
                if data[attr] != '':
                    filter_var = {attr: list(data[attr].split(','))}
                else:
                    filter_var = {attr: []}
            elif attr[-4:] == '__or':
                filter_var = {attr[:-4]: data[attr]}
                filter_var_list.append(filter_var)
                continue
            else:
                if data[attr] == 'null__korangle':
                    filter_var = {attr: None}
                elif data[attr] == 'false__boolean':
                    filter_var = {attr: False}
                elif data[attr] == 'true__boolean':
                    filter_var = {attr: True}
                else:
                    filter_var = {attr: data[attr]}

            if filter_var_list.__len__() > 0:
                filter_var_list.append(filter_var)
                q_total = Q()
                for q_variable in filter_var_list:
                    q_total = q_total | Q(**q_variable)
                try:
                    query_set = query_set.filter(q_total)
                except:
                    print('filter exception in or:')
                    print(filter_var_list)
                filter_var_list = []
            elif attr[:15] == 'korangle__order':
                try:
                    query_set = query_set.order_by(data[attr])
                except:
                    print('order exception:')
                    print(data[attr])
            elif attr == 'korangle__count':
                try:
                    count_array = list(map(int, data[attr].split(',')))
                    query_set = query_set[count_array[0]:count_array[1]]
                except:
                    print('count exception: ')
                    print(data[attr])
            else:
                try:
                    query_set = query_set.filter(**filter_var)
                except:
                    print('filter exception:')
                    print(filter_var)

    return_data = []

    for object in query_set:
        return_data.append(ModelSerializer(object).data)

    return return_data


def create_list(data_list, ModelSerializer, activeSchoolID, activeStudentID):
    return_data = []
    for data in data_list:
        return_data.append(create_object(data, ModelSerializer, activeSchoolID, activeStudentID))
    return return_data


def create_object(data, ModelSerializer, activeSchoolID, activeStudentID):
    serializer = ModelSerializer(data=data)
    assert serializer.is_valid(activeSchoolID=activeSchoolID, activeStudentID = activeStudentID), serializer.errors
    print(data)
    serializer.save()
    return serializer.data


def update_list(data_list, query_set, ModelSerializer, activeSchoolID, activeStudentID):
    return_data = []
    for data in data_list:
        return_data.append(update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID))
    return return_data


def update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID):        
    serializer = ModelSerializer(query_set.get(id=data['id']), data=data)
    assert serializer.is_valid(activeSchoolID=activeSchoolID, activeStudentID=activeStudentID)
    serializer.save()
    return serializer.data


def partial_update_list(data_list, query_set, ModelSerializer, activeSchoolID, activeStudentID):
    return_data = []
    for data in data_list:
        return_data.append(partial_update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID))
    return return_data


def partial_update_object(data, query_set, ModelSerializer, activeSchoolID, activeStudentID):
    serializer = ModelSerializer(query_set.get(id=data['id']), data=data, partial= True)
    assert serializer.is_valid(activeSchoolID=activeSchoolID, activeStudentID=activeStudentID)
    serializer.save()
    return serializer.data


def delete_object(data, query_set):
    query_set.get(id=data['id']).delete()
    return data['id']


def delete_list(data, query_set ):

    filter_var_list = []
    filter_var = ''

    if data != '' and data is not None:
        for index, attr in enumerate(data):

            if attr == 'e':
                continue
            elif attr[-4:] == '__in':
                if data[attr] != '':
                    filter_var = {attr: list(map(int, data[attr].split(',')))}
                else:
                    filter_var = {attr: []}
            elif attr[-4:] == '__or':
                filter_var = {attr[:-4]: data[attr]}
                filter_var_list.append(filter_var)
                continue
            else:
                if data[attr] == 'null__korangle':
                    filter_var = {attr: None}
                elif data[attr] == 'false__boolean':
                    filter_var = {attr: False}
                elif data[attr] == 'true__boolean':
                    filter_var = {attr: True}
                else:
                    filter_var = {attr: data[attr]}

            if filter_var_list.__len__() > 0:
                filter_var_list.append(filter_var)
                q_total = Q()
                for q_variable in filter_var_list:
                    q_total = q_total | Q(**q_variable)
                try:
                    query_set = query_set.filter(q_total)
                except:
                    print('filter exception in or:')
                    print(filter_var_list)
                filter_var_list = []
            else:
                try:
                    query_set = query_set.filter(**filter_var)
                except:
                    print('filter exception:')
                    print(filter_var)

    return_data = query_set.count()

    if return_data > 0:
        query_set.delete()

    return return_data

