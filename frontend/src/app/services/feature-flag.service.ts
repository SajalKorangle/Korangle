import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Constants } from '../classes/constants';
import { environment } from '../../environments/environment';

@Injectable()
export class FeatureFlagService {
    private featureFlagUrl = environment.DJANGO_SERVER + Constants.api_version + '/feature-flag/get-feature-flag-list';

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) {}

    getFeatureFlagList(): Promise<any> {
        return this.http
            .get(this.featureFlagUrl, { headers: this.headers })
            .toPromise()
            .then(
                (response) => {
                    return (<any>response).data;
                },
                (error) => {
                    return 'failed';
                }
            );
    }

}
