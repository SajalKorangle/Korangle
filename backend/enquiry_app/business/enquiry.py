
from enquiry_app.models import Enquiry

from rest_framework import serializers


class EnquiryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = '__all__'


def get_enquiry_list(data):

    enquiry_list = []

    for enquiry_object in \
            Enquiry.objects.filter(parentSchool_id=data['parentSchool'],
                                   dateOfEnquiry__gte=data['startDate'],
                                   dateOfEnquiry__lte=data['endDate'])\
            .order_by('dateOfEnquiry').select_related('parentClass'):
        enquiry_list.append(EnquiryModelSerializer(enquiry_object).data)

    return enquiry_list


def create_enquiry(data):

    enquiry_object = EnquiryModelSerializer(data=data)
    if enquiry_object.is_valid():
        enquiry_object.save()
        return 'Enquiry added successfully'
    else:
        return 'Enquiry creation failed'


def update_enquiry(data):

    enquiry_serializer = EnquiryModelSerializer(Enquiry.objects.get(id=data['id']), data=data)
    if enquiry_serializer.is_valid():
        enquiry_serializer.save()
        return 'Enquiry updated successfully'
    else:
        return 'Enquiry updation failed'


def get_enquiry(data):

    enquiry_object = Enquiry.objects.get(id=data['id'])
    return EnquiryModelSerializer(enquiry_object).data


def delete_enquiry(data):

    Enquiry.objects.get(id=data['id']).delete()

    return 'Enquiry deleted successfully'