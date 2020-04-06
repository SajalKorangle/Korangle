import {Injectable} from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable()
export class PincodeService {

    private pincodeUrl = 'https://api.postalpincode.in/pincode/';
    // private pincodeUrl = 'https://pincode.saratchandra.in/api/pincode/';

    private headers = new HttpHeaders({'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    getDetailsFromPincode(pincode: any): Promise<any> {
        // this.headers = new HttpHeaders({'Content-Type' : 'application/json'});
        return this.http.get(this.pincodeUrl+pincode )
            .toPromise()
            .then(response => {
                return (<any>response)[0].PostOffice;
            }, error => {
                console.log('Not able to get pincode details');
                return null;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
