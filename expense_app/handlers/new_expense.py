
from django.db.models import Max

from django.db.models.functions import Substr

from expense_app.models import Expense

from school_app.session import get_session_object

import datetime

def get_first_voucher_number():
    return 'E20171800001'

def new_expense(data):

    schoolDbId = data['schoolDbId']

    if 'voucherDate' not in data or data['voucherDate'] is None:
        data['voucherDate'] = datetime.datetime.today().strftime('%Y-%m-%d')

    if 'remark' not in data or data['remark'] is None:
        data['remark'] = ''

    session_object = get_session_object(data['voucherDate'])

    last_voucher = Expense.objects.filter(parentSchool__id=schoolDbId,
                                          voucherDate__gte=session_object.startDate,
                                          voucherDate__lte=session_object.endDate)\
        .aggregate(Max('voucherNumber'))

    new_voucher_number = ''
    if last_voucher['voucherNumber__max'] is None:
        new_voucher_number = get_first_voucher_number()
    else:
        new_voucher_number = 'E' + str(int(last_voucher['voucherNumber__max'][1:])+1)

    expense_object = Expense.objects.create(voucherNumber=new_voucher_number,
                                            amount=data['amount'],
                                            remark=data['remark'],
                                            voucherDate=data['voucherDate'],
                                            parentSchool_id=schoolDbId)

    response = {}
    response['voucherNumber'] = expense_object.voucherNumber
    response['voucherDate'] = expense_object.voucherDate
    response['amount'] = expense_object.amount
    response['remark'] = expense_object.remark

    return response