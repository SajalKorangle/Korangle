import {Injectable} from '@angular/core';

import { Expense } from '../classes/expense';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class ExpenseService {

    private newExpenseUrl = Constants.DJANGO_SERVER + '/expense/new_expense/';

    private expenseListUrl = Constants.DJANGO_SERVER + '/expense/expense_list/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    submitExpense(expense: any, token: any): Promise<any> {
        const body = JSON.stringify(expense);
        // const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.newExpenseUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                if (response.json().response.status === 'success') {
                    return response.json().response.data;
                } else {
                    alert(response.json().response.message);
                    return null;
                }
            })
            .catch(this.handleError);
    }

    getExpenseList(data: any, token: any): Promise<any> {
        const body = JSON.stringify(data);
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.expenseListUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                if (response.json().response.status === 'success') {
                    return response.json().response.data;
                } else {
                    alert(response.json().response.message);
                    return null;
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
