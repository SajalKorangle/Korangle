import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class BankService {
    private ifscUrl = 'https://ifsc.razorpay.com/';

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) {}

    getDetailsFromIFSCCode(ifsc: any): Promise<any> {
        // this.headers = new HttpHeaders({'Content-Type' : 'application/json'});
        return this.http
            .get(this.ifscUrl + ifsc)
            .toPromise()
            .then(
                (response) => {
                    return (<any>response).BANK;
                },
                (error) => {
                    console.log('Not able to get bank details');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
