from parent_test import ParentTestCase

from expense_app.models import Expense

class DatabaseTestCase(ParentTestCase):

    def test_one_school_per_expense(self):
        for expense_object in Expense.objects.all():
            self.assertIsNotNone(expense_object.parentSchool)

    def test_positive_amount_every_expense(self):
        for expense_object in Expense.objects.all():
            self.assertGreater(expense_object.amount,0)

    def test_start_with_e(self):
        for expense_object in Expense.objects.all():
            self.assertEqual(expense_object.voucherNumber[0],'E')