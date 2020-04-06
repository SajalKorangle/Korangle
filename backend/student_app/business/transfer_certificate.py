
from student_app.models import TransferCertificate

from rest_framework import serializers


class TransferCertificateModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferCertificate
        fields = '__all__'


def get_transfer_certificate(data):

    return TransferCertificateModelSerializer(TransferCertificate.objects.get(id=data['id'])).data


def create_transfer_certificate(data):

    transfer_certificate_serializer = TransferCertificateModelSerializer(data=data)
    if transfer_certificate_serializer.is_valid():
        instance = transfer_certificate_serializer.save()
        return {
            'status': 'success',
            'message': 'Transfer Certificate created successfully',
            'id': instance.id,
        }
    else:
        return {
            'status': 'failure',
            'message': 'Transfer Certificate creation failed',
        }


def update_transfer_certificate(data):

    transfer_certificate_serializer = TransferCertificateModelSerializer(TransferCertificate.objects.get(id=data['id']), data=data)
    if transfer_certificate_serializer.is_valid():
        transfer_certificate_serializer.save()
        return {
            'status': 'success',
            'message': 'Transfer Certificate updated successfully',
        }
    else:
        return {
            'status': 'failure',
            'message': 'Transfer Certificate updation failed',
        }

def delete_transfer_certificate(transfer_certificate_id):
    TransferCertificate.objects.get(id=transfer_certificate_id).delete()
    return 'TC deleted successfully'
