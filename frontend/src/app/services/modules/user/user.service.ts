import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Constants } from '@classes/constants';

@Injectable()
export class UserService extends ServiceObject {
    protected module_url = '/user';

    // objects urls
    public user = '/users';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }

    public newPassword(body: any, jwt: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'JWT ' + jwt });
        return this.http_class
            .post(environment.DJANGO_SERVER + Constants.api_version + this.module_url + '/change-password', body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    // return this.returnResponse(response);
                    return response;
                },
                (error) => {
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }
}
