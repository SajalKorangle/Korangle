
from django.db import transaction

from django.db.models import Max

from student_app.models import Student


def create_discount_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(create_discount_object(data, Model, ModelSerializer))
    return return_data


def create_discount_object(data, Model, ModelSerializer):

    data['discountNumber'] = 1
    schoolId = Student.objects.get(id=data['parentStudent']).parentSchool.id

    with transaction.atomic():
        last_discount_number = \
            Model.objects.filter(parentStudent__parentSchool=schoolId)\
                .aggregate(Max('discountNumber'))['discountNumber__max']
        if last_discount_number is not None:
            data['discountNumber'] = last_discount_number + 1

    serializer = ModelSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return serializer.data
    else:
        return 'Creation failed'

