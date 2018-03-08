from parent_test import ParentTestCase
from school_app.models import School

from django.contrib.auth.models import User

from expense_app.models import Expense

from expense_app.handlers.new_expense import new_expense

import datetime


class NewExpenseTestCase(ParentTestCase):

    # Method Check
    def test_new_expense(self):

        expense = {}
        expense['remark'] = 'testing'
        expense['amount'] = 1000
        expense['schoolDbId'] = School.objects.get(user=User.objects.get(username='demo')).id

        new_expense(expense)

        expense_queryset = Expense.objects.filter(amount=1000,
                                                  parentSchool_id=expense['schoolDbId'],
                                                  voucherDate=datetime.datetime.today().strftime('%Y-%m-%d'))

        self.assertGreaterEqual(expense_queryset.count(),1)
        self.assertEqual(expense_queryset[0].voucherNumber[0],'E')

        expense = {}
        expense['remark'] = 'testing'
        expense['amount'] = 2000
        # expense['voucherDate'] = datetime.datetime.today().strftime('%Y-%m-%d')
        expense['schoolDbId'] = School.objects.get(user=User.objects.get(username='demo')).id

        new_expense(expense)

        expense_queryset_two = Expense.objects.filter(amount=2000,
                                                  parentSchool_id=expense['schoolDbId'],
                                                  voucherDate=datetime.datetime.today().strftime('%Y-%m-%d'))

        self.assertGreaterEqual(expense_queryset_two.count(), 1)
        self.assertEqual(expense_queryset_two[0].voucherNumber[0], 'E')

        self.assertEqual(int(expense_queryset[len(expense_queryset)-1].voucherNumber[1:])+1,
                         int(expense_queryset_two[len(expense_queryset_two)-1].voucherNumber[1:]))