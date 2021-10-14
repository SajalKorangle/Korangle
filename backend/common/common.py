from functools import reduce


class BasePermission:
    RelationsToSchool = []
    RelationsToStudent = []

    def is_valid(self, validated_data, activeSchoolId, activeStudentIdList):

        print('rekations to school = ', self.RelationsToSchool)
        print('rekations to student = ', self.RelationsToStudent)
        print('validated data = ', validated_data)
        # Checking for Parent
        if(activeStudentIdList):
            for relation in self.RelationsToStudent:
                splitted_relation = relation.split('__')
                parent_instance = validated_data.get(splitted_relation[0], None)
                if parent_instance is not None:
                    if not (reduce(lambda instance, parent_field: getattr(instance, parent_field) if(instance is not None) else None, splitted_relation[1:], parent_instance) in activeStudentIdList):
                        return False

        # Checking for Parent & Employee Both
        for relation in self.RelationsToSchool:
            splitted_relation = relation.split('__')
            parent_instance = validated_data.get(splitted_relation[0], None)
            if parent_instance is not None:
                if (reduce(lambda instance, parent_field: getattr(instance, parent_field) if(instance is not None) else None, splitted_relation[1:], parent_instance) != activeSchoolId):
                    return False
        return True
