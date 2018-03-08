from parent_test import ParentTestCase

from school_app.models import Fee, SubFee, Student

class DbValidityTestCase(ParentTestCase):

    def test_all_fees_are_valid(self):

        feeCount = 0
        for student_object in Student.objects.all():
            feeCount += student_object.fee_set.all().count()

        self.assertEqual(feeCount, Fee.objects.all().count())


    def test_all_subfees_are_valid(self):

        subFeeCount = 0
        for fee_object in Fee.objects.all():
            subFeeCount += fee_object.subfee_set.all().count()

        self.assertEqual(subFeeCount, SubFee.objects.all().count())

    def test_fee_subfee_amount_are_valid(self):

        for fee_object in Fee.objects.all():
            feeAmount = 0
            subFee_queryset = fee_object.subfee_set.all()
            for subFee_object in subFee_queryset:
                feeAmount += subFee_object.amount
            if subFee_queryset.count() > 0:
                self.assertEqual(feeAmount, fee_object.amount)