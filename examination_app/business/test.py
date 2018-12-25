
from examination_app.models import TestSecond

from rest_framework import serializers


class TestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSecond
        fields = '__all__'


def get_test_list(data):

    test_list = []

    test_query = TestSecond.objects.all()

    if 'examinationList' in data:
        if data['examinationList'] != '':
            test_query = test_query.filter(parentExamination__in=data['examinationList'].split(','))
        if data['subjectList'] != '':
            test_query = test_query.filter(parentSubject__in=data['subjectList'].split(','))
        if data['classList'] != '':
            test_query = test_query.filter(parentClass__in=data['classList'].split(','))
        if data['sectionList'] != '':
            test_query = test_query.filter(parentDivision__in=data['sectionList'].split(','))
        if data['startTimeList'] != '':
            test_query = test_query.filter(startTime__in=data['startTimeList'].split(','))
        if data['endTimeList'] != '':
            test_query = test_query.filter(endTime__in=data['endTimeList'].split(','))
        if data['maximumMarksList'] != '':
            test_query = test_query.filter(maximumMarks__in=data['maximumMarksList'].split(','))
    else:
        if 'schoolId' in data and 'sessionId' in data:
            test_query = TestSecond.objects.filter(parentExamination__parentSchool_id=data['schoolId'],
                                                   parentExamination__parentSession_id=data['sessionId'])
        elif 'examinationId' in data and 'classId' in data and 'sectionId' in data:
            test_query = TestSecond.objects.filter(parentExamination_id=data['examinationId'],
                                                   parentClass_id=data['classId'],
                                                   parentDivision_id=data['sectionId'])

    for test_object in test_query:
        test_list.append(TestModelSerializer(test_object).data)

    return test_list


def create_test(data):

    test_serializer = TestModelSerializer(data=data)
    if test_serializer.is_valid():
        test_serializer.save()
        return test_serializer.data
    else:
        return 'Test creation failed'


def delete_test(test_id):

    TestSecond.objects.get(id=test_id).delete()
    return 'Test deleted successfully'
