from functools import reduce


class BasePermission:
    RelationsToSchool = []
    RelationsToStudent = []

    def is_valid(self, validated_data, activeSchoolId, activeStudentIdList):

        # Checking for Parent
        if(activeStudentIdList):
            for relation in self.RelationsToStudent:
                splitted_relation = relation.split('__')
                parent_instance = validated_data.get(splitted_relation[0], None)
                reduced_id = reduce(lambda instance, parent_field: getattr(instance, parent_field) if(instance is not None) else None, splitted_relation[1:], parent_instance)
                if reduced_id is not None and reduced_id not in activeStudentIdList:
                    return False

        # Checking for Parent & Employee Both
        for relation in self.RelationsToSchool:
            splitted_relation = relation.split('__')
            parent_instance = validated_data.get(splitted_relation[0], None)
            reduced_id = reduce(lambda instance, parent_field: getattr(instance, parent_field) if(instance is not None) else None, splitted_relation[1:], parent_instance)
            if reduced_id is not None and reduced_id != activeSchoolId:
                return False
        return True
