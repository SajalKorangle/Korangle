import {Injectable} from '@angular/core';

import { Expense } from '../classes/expense';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class ExpenseListService {

    private expenseListUrl = Constants.DJANGO_SERVER + 'expense_list/';

    private newExpenseUrl = Constants.DJANGO_SERVER + 'new_expense/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getExpenseList(startDate: any, endDate: any): Promise<Expense[]> {
        const body = JSON.stringify({'startDate': startDate, 'endDate': endDate});
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.expenseListUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data as Expense[];
            })
            .catch(this.handleError);
    }

    submitExpense(expense: any): Promise<any> {
        const body = JSON.stringify(expense);
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.newExpenseUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
