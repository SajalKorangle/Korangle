import factory

from student_app.factories.student import StudentFactory

from django.contrib.auth.models import User


class SubFeeReceiptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.SubFeeReceipt'
        django_get_or_create = ('parentStudentFeeComponent', 'parentFeeReceipt', 'amount')


class FeeReceiptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.FeeReceipt'
        django_get_or_create = ('cancelled', 'remark', 'parentReceiver', 'parentStudent')

    parentStudent = factory.SubFactory(StudentFactory)
    parentReceiver = User.objects.all()[0]
    remark = 'testing'
    cancelled = False

    @factory.post_generation
    def create_sub_fee_receipt(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            student_fee_component_object = None
            SubFeeReceiptFactory(parentStudentFeeComponent=student_fee_component_object,
                                 parentFeeReceipt=self,
                                 amount=1000)

