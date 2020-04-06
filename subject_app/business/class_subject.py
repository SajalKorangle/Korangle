
from subject_app.models import ClassSubject

from rest_framework import serializers


class ClassSubjectModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSubject
        fields = '__all__'


def create_class_subject(data):

    class_subject_serializer = ClassSubjectModelSerializer(data=data)
    if class_subject_serializer.is_valid():
        class_subject_serializer.save()
        return class_subject_serializer.data
    else:
        return 'Subject addition in class failed'


def update_class_subject(data):

    class_subject_serializer = ClassSubjectModelSerializer(ClassSubject.objects.get(id=data['id']), data=data)
    if class_subject_serializer.is_valid():
        class_subject_serializer.save()
        return 'Class Subject updated successfully'
    else:
        return 'Class Subject updation failed'


def delete_class_subject(data):

    ClassSubject.objects.get(id=data).delete()

    return 'Subject removed from class successfully'


def get_class_subject_list(data):

    class_subject_list = []

    class_subject_query = ClassSubject.objects.all()

    if 'subjectList' in data and data['subjectList'] != '':
        class_subject_query = class_subject_query.filter(parentSubject__in=data['subjectList'].split(','))
    if 'schoolList' in data and data['schoolList'] != '':
        class_subject_query = class_subject_query.filter(parentSchool__in=data['schoolList'].split(','))
    if 'employeeList' in data and data['employeeList'] != '':
        class_subject_query = class_subject_query.filter(parentEmployee__in=data['employeeList'].split(','))
    if 'classList' in data and data['classList'] != '':
        class_subject_query = class_subject_query.filter(parentClass__in=data['classList'].split(','))
    if 'sectionList' in data and data['sectionList'] != '':
        class_subject_query = class_subject_query.filter(parentDivision__in=data['sectionList'].split(','))
    if 'sessionList' in data and data['sessionList'] != '':
        class_subject_query = class_subject_query.filter(parentSession__in=data['sessionList'].split(','))
    if 'mainSubject' in data and data['mainSubject'] != '':
        class_subject_query = class_subject_query.filter(mainSubject=data['mainSubject'])
    if 'onlyGrade' in data and data['onlyGrade'] != '':
        class_subject_query = class_subject_query.filter(onlyGrade=data['onlyGrade'])
    '''if 'subjectList' in data:
        if 'subjectList' in data and data['subjectList'] != '':
            class_subject_query = class_subject_query.filter(parentSubject__in=data['subjectList'].split(','))
        if 'schoolList' in data and data['schoolList'] != '':
            class_subject_query = class_subject_query.filter(parentSchool__in=data['schoolList'].split(','))
        if 'employeeList' in data and data['employeeList'] != '':
            class_subject_query = class_subject_query.filter(parentEmployee__in=data['employeeList'].split(','))
        if 'classList' in data and data['classList'] != '':
            class_subject_query = class_subject_query.filter(parentClass__in=data['classList'].split(','))
        if 'sectionList' in data and data['sectionList'] != '':
            class_subject_query = class_subject_query.filter(parentDivision__in=data['sectionList'].split(','))
        if 'sessionList' in data and data['sessionList'] != '':
            class_subject_query = class_subject_query.filter(parentSession__in=data['sessionList'].split(','))
        if 'mainSubject' in data and data['mainSubject'] != '':
            class_subject_query = class_subject_query.filter(mainSubject=data['mainSubject'])
        if 'onlyGrade' in data and data['onlyGrade'] != '':
            class_subject_query = class_subject_query.filter(onlyGrade=data['onlyGrade'])
    else:
        if 'classId' in data and 'sectionId' in data:
            class_subject_query = ClassSubject.objects.filter(parentSession_id=data['sessionId'],
                                                              parentClass_id=data['classId'],
                                                              parentDivision_id=data['sectionId'],
                                                              parentSchool_id=data['schoolId'])
        else:
            class_subject_query = ClassSubject.objects.filter(parentSession_id=data['sessionId'],
                                                              parentSchool_id=data['schoolId'])'''

    for class_subject_object in class_subject_query:
        class_subject_list.append(ClassSubjectModelSerializer(class_subject_object).data)

    return class_subject_list
