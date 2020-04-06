from expense_app.models import Expense

def expense_list_date_wise(data):

    schoolDbId = data['schoolDbId']

    expense_list = []
    for expense_object in Expense.objects.filter(voucherDate__gte=data['startDate'],
                                              voucherDate__lte=data['endDate'],
                                              parentSchool_id=schoolDbId).order_by('voucherDate','voucherNumber'):
        tempExpense = {}
        tempExpense['voucherNumber'] = expense_object.voucherNumber
        tempExpense['voucherDate'] = expense_object.voucherDate
        tempExpense['amount'] = expense_object.amount
        tempExpense['remark'] = expense_object.remark
        expense_list.append(tempExpense)
    return expense_list