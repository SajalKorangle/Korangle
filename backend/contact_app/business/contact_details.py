from rest_framework import serializers

from contact_app.models import ContactDetail


class ContactDetailModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetail
        fields = '__all__'


def create_contact_details(data):
    # ------ Creating Contact Detail Entry Starts----- #
    details_serializer = ContactDetailModelSerializer(data=data)
    if details_serializer.is_valid():
        details_serializer.save()
        return {
            'id': details_serializer.data['id'],
            'status': 'success',
            'message': 'Contact created successfully',
        }
    else:
        print(details_serializer.errors)
        return {
            'status': 'failure',
            'message': 'Contact Details creation Failed',
        }
    # ------ Creating Contact Detail Entry Ends----- #
