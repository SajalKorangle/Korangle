
from django.db import transaction

from django.db.models import Max

from student_app.models import Student


def create_fee_receipt_list(data_list, Model, ModelSerializer):
    return_data = []
    for data in data_list:
        return_data.append(create_fee_receipt_object(data, Model, ModelSerializer))
    return return_data


def create_fee_receipt_object(data, Model, ModelSerializer):

    data['receiptNumber'] = 1
    schoolId = Student.objects.get(id=data['parentStudent']).parentSchool.id

    with transaction.atomic():
        last_receipt_number = \
            Model.objects.filter(parentStudent__parentSchool=schoolId)\
                .aggregate(Max('receiptNumber'))['receiptNumber__max']
        if last_receipt_number is not None:
            data['receiptNumber'] = last_receipt_number + 1

        print(data)

        serializer = ModelSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return serializer.data
        else:
            return 'Creation failed'

