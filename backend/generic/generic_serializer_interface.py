from django.db.models import Q
from rest_framework import serializers
from django.db.models.fields.related import ForeignKey
from common.json_encoding import make_dict_list_serializable
from helloworld_project.settings import AWS_S3_BASE_URL

from django.db.models import Count, Sum

AGGREGATOR_FUNCTION_MAPPED_BY_NAME = {
    'Count': Count,
    'Sum': Sum,
}


def get_default_filter():
    return {'filter_args': [], 'filter_kwargs': {}}


class GenericSerializerInterface():
    Model = None
    data = None
    activeSchoolId = None
    activeStudentIdList = None
    partial = False

    method: None

    def __init__(self, data, Model, activeSchoolId, activeStudentIdList=None, partial=False):
        self.data = data
        self.Model = Model
        self.activeSchoolId = activeSchoolId
        self.activeStudentIdList = activeStudentIdList
        self.partial = partial

    def get_model_serializer(self, fields_list=None):
        GenericSerializerInterface_self = self

        class ModelSerializer(serializers.ModelSerializer):

            def is_valid(self):

                super_response = super().is_valid(raise_exception=False)
                if not super_response:
                    return False

                return self.Meta.model.Permissions().is_valid(self.validated_data, GenericSerializerInterface_self.activeSchoolId, GenericSerializerInterface_self.activeStudentIdList)

            class Meta:
                model = self.Model
                fields = '__all__' if fields_list is None else fields_list

        return ModelSerializer

    def parseFilter(self, data):
        filter_kwargs = {}
        filter_args = []
        for attr, value in data.items():

            if attr.startswith('__or__'):  # __or__<nonce>: [{<filter1>}, {<filter2>}, ...]
                or_filter_aggregate = ~Q()
                for or_filter in value:
                    db_filter = self.parseFilter(or_filter)
                    or_filter_aggregate = or_filter_aggregate | Q(*db_filter['filter_args'], **db_filter['filter_kwargs'])
                filter_args.append(or_filter_aggregate)
            else:
                filter_kwargs.update({attr: value})  # filters like id__in, parentSession etc.

        return {'filter_args': filter_args, 'filter_kwargs': filter_kwargs}

    def parse_query(self, data):
        query = self.Model.objects.filter(self.Model.Permissions().getPermittedQuerySet(self.activeSchoolId, self.activeStudentIdList))

        for key, value in data.items():
            if key == 'filter':
                parsed_filter = self.parseFilter(value)
                query = query.filter(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
            elif key == 'exclude':
                parsed_filter = self.parseFilter(value)
                query = query.exclude(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs'])
            elif key == 'union':
                for union_query in value:
                    parsed_query = self.parse_query(union_query)
                    query = query.union(parsed_query)
            elif key == 'annotate':
                for alias_name, alias_generator_data in value.items():
                    parsed_filter = self.parseFilter(alias_generator_data['filter']) if 'filter' in alias_generator_data else self.parseFilter(alias_generator_data['exclude']) if 'exclude' in alias_generator_data else get_default_filter()
                    annotate_field_name = alias_generator_data['field']
                    annotate_function = AGGREGATOR_FUNCTION_MAPPED_BY_NAME[alias_generator_data['function']]
                    if 'exclude' in alias_generator_data:
                        query = query.annotate(**{alias_name: annotate_function(
                            annotate_field_name,
                            filter=~Q(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs']),
                        )})
                    else: 
                        query = query.annotate(**{alias_name: annotate_function(
                            annotate_field_name,
                            filter=Q(*parsed_filter['filter_args'], **parsed_filter['filter_kwargs']),
                        )})
            elif key in ['order_by', 'pagination']:
                pass
            else:
                raise Exception('Invalid key in GET object Query')

        if 'order_by' in data:
            query = query.order_by(*self.data['order_by'])
        if 'pagination' in data:
            start, end = data['pagination']['start'], data['pagination']['end']
            query = query[start:end]

        return query

    def get_object(self):
        list_response = self.get_object_list()
        if(len(list_response) == 0):
            return None
        elif len(list_response) > 1:
            raise Exception('Multiple objects found for get_object')
        return list_response[0]

    def get_object_list(self):

        child_field_name_mapped_by_query = {}
        parent_field_name_mapped_by_query = {}

        ## Response Structure(fields_list) Processing Starts ##
        processed_field_list = ['__all__']
        file_field_list = []
        if 'fields_list' in self.data:
            processed_field_list = self.data['fields_list']
            file_field_list = [field.name for field in self.Model._meta.concrete_fields if field.name in self.data['fields_list'] and self.Model._meta.get_field(field.name).get_internal_type() == 'FileField']
            del self.data['fields_list']

        if '__all__' in processed_field_list:
            __all__index = processed_field_list.index('__all__')
            processed_field_list[__all__index: __all__index + 1] = [field.name for field in self.Model._meta.concrete_fields]  # Replacing __all__ with concrete fields
            file_field_list = [field.name for field in self.Model._meta.concrete_fields if self.Model._meta.get_field(field.name).get_internal_type() == 'FileField']

        if 'parent_query' in self.data:
            parent_field_name_mapped_by_query = self.data['parent_query']
            processed_field_list += parent_field_name_mapped_by_query.keys()
            del self.data['parent_query']

        if 'child_query' in self.data:
            child_field_name_mapped_by_query = self.data['child_query']
            del self.data['child_query']

        ## Response Structure(fields_list) Processing Ends ##

        query_set = self.parse_query(self.data)

        pk_field_name = self.Model._meta.pk.name
        processed_field_list.append(pk_field_name)  # ensuring pk field is always included, duplicates are allowed
        return_data = list(query_set.values(*processed_field_list))

        # Starts :- Make file fields' url absolute
        if len(file_field_list) > 0:
            for row in return_data:
                for field in file_field_list:
                    row[field] = AWS_S3_BASE_URL + row[field] if row[field] and row[field] != '' else row[field]
        # Ends :- Make file fields' url absolute

        return_data = make_dict_list_serializable(return_data)  # making json serializable

        pk_list = [instance_data[pk_field_name] for instance_data in return_data]

        ## Child Nested Data Query Starts ##
        for key, value in child_field_name_mapped_by_query.items():
            assert key in self.Model._meta.fields_map, 'Invalid Child Name in Child Query, child name: {0}, query: {1}'.format(key, value)
            child_field_name = self.Model._meta.fields_map[key].field.name
            child_model = self.Model._meta.fields_map[key].related_model
            value.update({   # added parent<Model> filter
                'filter': dict(value.get('filter', {}), **{
                    child_field_name + "__in": pk_list
                })
            })

            aggregated_child_data_list = GenericSerializerInterface(
                data=value, Model=child_model, activeSchoolId=self.activeSchoolId, activeStudentIdList=self.activeStudentIdList).get_object_list()

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
            parent_model = self.Model._meta.get_field(key).related_model
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

            aggregated_parent_data_list = GenericSerializerInterface(
                data=value, Model=parent_model, activeSchoolId=self.activeSchoolId, activeStudentIdList=self.activeStudentIdList).get_object_list()

            ## Regrouping Starts ##
            parent_data_mapped_by_pk = {}
            for data in aggregated_parent_data_list:
                parent_data_mapped_by_pk[data[parent_model_pk_field_name]] = data
            for data in return_data:
                if data[key] is not None:
                    data[key + 'Instance'] = parent_data_mapped_by_pk[data[key]]
            ## Regrouping Ends ##
        ## Parent Nested Data Query Ends ##

        # Total No of DB Queries = 1 + No of child Queries + No of parent Queries

        return return_data

    def operate_list(self, operation_function):  # Generic function for list operations
        response = []
        for instance_data in self.data:
            response.append(self.operate_object(instance_data, operation_function))
        return response

    def operate_object(self, data, operation_function):  # Generic function for object operations
        data_list_mapped_by_child_related_field_name = {}

        for child_related_field_name in [field_name for field_name in data.keys() if field_name.endswith('List')]:
            data_list_mapped_by_child_related_field_name[child_related_field_name] = data[child_related_field_name]
            del data[child_related_field_name]

        response = operation_function(data)
        for child_related_field_name, child_data_list in data_list_mapped_by_child_related_field_name.items():
            # removing list from end and finding the related model field
            child_related_field = self.Model._meta.fields_map.get(child_related_field_name, None)
            if not child_related_field:
                raise Exception('Invalid Field Name for Related Fields: {0} '.format(child_related_field_name))  # verbose message for debugging

            child_model = child_related_field.related_model

            parent_primary_key_value = response[self.Model._meta.pk.name]
            for child_data in child_data_list:
                child_data.update({child_related_field.remote_field.name: parent_primary_key_value})

            child_serializer = GenericSerializerInterface(Model=child_model, data=child_data_list,
                                                            activeSchoolId=self.activeSchoolId, activeStudentIdList=self.activeStudentIdList, partial=self.partial)
            child_response = getattr(child_serializer, self.method + '_object_list')()
            response.update({child_related_field_name: child_response})
        return response

    def create_object_operation(self, data):
        ModelSerializer = self.get_model_serializer()
        serializer = ModelSerializer(data=data)
        assert serializer.is_valid(), "{0}\n data = {1}".format(serializer.errors, data)
        serializer.save()
        return serializer.data

    def create_object_list(self):
        self.method = 'create'
        return self.operate_list(self.create_object_operation)

    def create_object(self):
        self.method = 'create'
        return self.operate_object(self.data, self.create_object_operation)

    def get_update_object_operation(self):
        def update_object_operation(data):
            permitted_query_set = self.Model.objects.filter(self.Model.Permissions().getPermittedQuerySet(self.activeSchoolId, self.activeStudentIdList))
            main_model_pk_field_name = self.Model._meta.pk.name

            ModelSerializer = self.get_model_serializer()
            serializer = ModelSerializer(permitted_query_set.get(**{main_model_pk_field_name: data[main_model_pk_field_name]}), data=data, partial=self.partial)
            assert serializer.is_valid(), "{0}\n data = {1}".format(serializer.errors, data)
            serializer.save()
            return serializer.data
        return update_object_operation

    def update_object_list(self):
        self.method = 'update'
        return self.operate_list(self.get_update_object_operation())

    def update_object(self):
        self.method = 'update'
        return self.operate_object(self.data, self.get_update_object_operation())

    def delete_object(self):
        return self.delete_object_list(onlyOne=True)

    def delete_object_list(self, onlyOne=False):
        child_field_name_mapped_by_query = {}

        if 'fields_list' in self.data:
            for field_data in self.data['fields_list']:
                if type(field_data) == dict:  # parent/child nested field
                    if field_data['name'] in self.Model._meta.fields_map:
                        child_field_name_mapped_by_query[field_data['name']] = field_data.get('query', {})
                    else:
                        raise Exception('Invalid child data dict in Delete Query')
                else:
                    raise Exception('Invalid field name in DELETE Query')
            del self.data['fields_list']
        ## Response Structure(fields_list) Processing Ends ##

        query_set = self.parse_query(self.data)
        count = query_set.count()
        assert (not onlyOne or count == 1), 'More than one object to delete while onlyOne=True'

        pk_field_name = self.Model._meta.pk.name
        pk_list = query_set.values_list(pk_field_name, flat=True)

        for key, value in child_field_name_mapped_by_query.items():
            child_field_name = self.Model._meta.fields_map[key].field.name
            child_model = self.Model._meta.fields_map[key].related_model
            value.update({   # added parent<Model> filter
                'filter': dict(value.get('filter', {}), **{
                    child_field_name + "__in": pk_list
                })
            })

            GenericSerializerInterface(Model=child_model, data=value, activeSchoolId=self.activeSchoolId,
                                        activeStudentIdList=self.activeStudentIdList).delete_object_list()

        query_set.delete()
        return count
