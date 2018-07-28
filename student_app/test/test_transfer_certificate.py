
from parent_test import ParentTestCase

# Factory
from student_app.factories.transfer_certificate import TransferCertificateFactory

# Business
from student_app.business.transfer_certificate \
    import create_transfer_certificate, get_transfer_certificate, update_transfer_certificate, \
    TransferCertificateModelSerializer

# Model
from student_app.models import TransferCertificate


class TransferCertificateProfileTestCase(ParentTestCase):

    def test_create_transfer_certificate(self):

        data = {
            'certificateNumber': 123,
            'issueDate': '2008-01-01',
            'admissionDate': '2008-01-01',
            'leavingDate': '2008-01-01',
            'leavingReason': 'he is moving to a different city',
            'admissionClass': 'Class - 1',
            'lastClassPassed': 'Class - 7',
            'leavingMidSession': True,
            'lastClassAttended': 'Class - 8',
            'lastClassAttendance': 150,
            'attendanceOutOf': 160,
        }

        create_transfer_certificate(data)

        TransferCertificate.objects.get(certificateNumber=data['certificateNumber'],
                                        admissionClass=data['admissionClass'],
                                        lastClassPassed=data['lastClassPassed'])

    def test_update_transfer_certificate(self):

        transfer_certificate_object = TransferCertificateFactory()

        transfer_certificate_serializer = TransferCertificateModelSerializer(transfer_certificate_object)

        data = transfer_certificate_serializer.data

        data['certificateNumber'] = 111

        update_transfer_certificate(data)

        self.assertEqual(TransferCertificate.objects.get(id=transfer_certificate_serializer.data['id']).certificateNumber,
                         data['certificateNumber'])

    def test_get_transfer_certificate(self):

        transfer_certificate_object = TransferCertificateFactory()

        data = {
            'id': transfer_certificate_object.id,
        }

        response = get_transfer_certificate(data)

        self.assertEqual(response['certificateNumber'], int(transfer_certificate_object.certificateNumber))
        self.assertEqual(response['id'], data['id'])

