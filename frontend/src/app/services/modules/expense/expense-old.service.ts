import { Injectable } from '@angular/core';

import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class ExpenseOldService extends CommonServiceRequirements {
    private newExpenseUrl = '/expense/new_expense/';

    private expenseListUrl = '/expense/expense_list/';

    submitExpense(expense: any, token: any): Promise<any> {
        return super.postData(JSON.stringify(expense), token, this.newExpenseUrl);
    }

    getExpenseList(data: any, token: any): Promise<any> {
        return super.postData(JSON.stringify(data), token, this.expenseListUrl);
    }
}
