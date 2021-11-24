from functools import reduce
from django.db.models import Q


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

    def getPermittedQuerySet(self, activeSchoolId, activeStudentIdList):
        query_filters = {}

        # Here we are banking on the fact that
        # 1. if RelationsToStudent exist then RelationsToSchool always exist,
        # 2. activeStudentId represents parent, non existence of activeStudentId & existence of activeSchoolId represents employee, nothing represent simple user.

        if (activeStudentIdList and len(self.RelationsToStudent) > 0):  # for parent only, activeStudentID can be a list of studentId's
            query_filters[self.RelationsToStudent[0] + '__in'] = activeStudentIdList     # takes the first relation to student only(should be the closest)
        elif (len(self.RelationsToSchool) > 0):
            query_filters[self.RelationsToSchool[0]] = activeSchoolId    # takes the first relation to school only(should be the the closest)
        return Q(**query_filters)
