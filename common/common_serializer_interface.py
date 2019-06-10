
import json

from django.db.models import Q


def get_object(data, Model, ModelSerializer):
    object = Model.objects.get(id=data['id'])
    return ModelSerializer(object).data


def get_list(data, Model, ModelSerializer):

    query = Model.objects.all()

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
                    query = query.filter(q_total)
                except:
                    print('filter exception in or:')
                    print(filter_var_list)
                filter_var_list = []
            else:
                try:
                    query = query.filter(**filter_var)
                except:
                    print('filter exception:')
                    print(filter_var)


    return_data = []

    for object in query:
        return_data.append(ModelSerializer(object).data)

    return return_data


def create_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(create_object(data, Model, ModelSerializer))
    return return_data


def create_object(data, Model, ModelSerializer):
    serializer = ModelSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    serializer.save()
    return serializer.data


def update_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(update_object(data, Model, ModelSerializer))
    return return_data


def update_object(data, Model, ModelSerializer):

    instance_field_list = Model._meta.get_fields(include_parents=False)
    instance_field_list = list(map(lambda x: x.name, filter(lambda x: x.concrete and x.get_internal_type() == 'FileField',
                                                       instance_field_list)))
    delete_list = []
    for attr, value in data.items():
        if attr in instance_field_list:
            delete_list.append(attr)
    for field_name in delete_list:
        del data[field_name]

    serializer = ModelSerializer(Model.objects.get(id=data['id']), data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'Updation failed'


def partial_update_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(partial_update_object(data, Model, ModelSerializer))
    return return_data


def partial_update_object(data, Model, ModelSerializer):
    serializer = ModelSerializer(Model.objects.get(id=data['id']), data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        return 'Updation failed'


def delete_object(data, Model, ModelSerializer):
    Model.objects.get(id=data['id']).delete()
    return data['id']


def delete_list(data, Model, ModelSerializer):
    if data['id'] is not None and data['id'] != '':
        Model.objects.filter(id__in=data['id'].split(',')).delete()
    return data['id']

