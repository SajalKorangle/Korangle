
import factory

from datetime import datetime, date

class TransferCertificateFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'student_app.TransferCertificate'
        django_get_or_create = ('certificateNumber', 'issueDate',
                                'leavingDate', 'leavingReason', 'admissionClass',
                                'lastClassPassed', 'leavingMidSession')

    certificateNumber = factory.Sequence(lambda n: '%s' % n)
    issueDate = date(2008, 1, 1)
    # admissionDate = date(2008, 1, 1)
    leavingDate = date(2008, 1, 1)
    leavingReason = ' he is moving to a different city'
    admissionClass = 'Class - 1'
    lastClassPassed = 'Class - 8'
    leavingMidSession = False
