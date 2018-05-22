from parent_test import ParentTestCase
from school_app.model.models import School

from django.contrib.auth.models import User

from expense_app.models import Expense

from expense_app.handlers.expense_list_date_wise import expense_list_date_wise
from expense_app.handlers.new_expense import new_expense

import datetime


class ExpenseListDateWiseTestCase(ParentTestCase):

    # Method Check
    def test_expense_list_date_wise(self):

        schoolDbId = School.objects.get(name='DEMO').id

        expense = {}
        expense['remark'] = 'testing'
        expense['amount'] = 1000
        expense['schoolDbId'] = schoolDbId

        new_expense(expense)

        expense = {}
        expense['remark'] = 'testing'
        expense['amount'] = 2000
        expense['voucherDate'] = datetime.datetime.today().strftime('%Y-%m-%d')
        expense['schoolDbId'] = schoolDbId

        new_expense(expense)

        data = {}
        data['startDate'] = datetime.datetime.today().strftime('%Y-%m-%d')
        data['endDate'] = datetime.datetime.today().strftime('%Y-%m-%d')
        data['schoolDbId'] = schoolDbId
        expense_list = expense_list_date_wise(data)

        self.assertGreaterEqual(len(expense_list),2)

        for expense_object in expense_list:
            self.assertEqual(expense_object['voucherDate'].__str__(),datetime.datetime.today().strftime('%Y-%m-%d'))
