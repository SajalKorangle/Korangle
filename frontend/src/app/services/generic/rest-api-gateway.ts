import { Injectable } from '@angular/core';

import { Constants } from '../../classes/constants';
import { environment } from '../../../environments/environment';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataStorage } from '../../classes/data-storage';
import { reportError, ERROR_SOURCES } from '../modules/errors/error-reporting.service';
import { checkTokenRevokedStatus } from '@services/revokedTokenHandling';

const MAX_URL_LENGTH = 2048;

@Injectable()
export class RestApiGateway {
    reportError = reportError;

    constructor(private http: HttpClient) { }

    public getToken(): any {
        return DataStorage.getInstance().getUser().jwt;
    }

    getAbsoluteURL(url: string, params: { [key: string]: any; } = {}): string {
        let absolute_url = new URL(environment.DJANGO_SERVER + Constants.api_version + url);
        Object.entries(params).forEach(([key, value]) => absolute_url.searchParams.set(key, value));
        let user = DataStorage.getInstance().getUser();
        if (user.activeSchool) {
            if (user.activeSchool.role === 'Employee') {
                absolute_url.searchParams.append('activeSchoolId', user.activeSchool.dbId);
            } else if (user.activeSchool.role === 'Parent') {
                absolute_url.searchParams.append('activeStudentIdList', user.activeSchool.studentList.map((s) => s.id).join(','));
            } else {
                alert('Alert: Contact Admin');
            }
        }
        return absolute_url.toString();
    }

    public returnResponse(response: any, url: any = null, prompt: string = null): any {

        //  Handling revoked rokens here
        if ( checkTokenRevokedStatus(response)) {
            return null;
        }

        if ('success' in response) {
            return response['success'];
        } else if ('fail' in response) {
            this.reportError(ERROR_SOURCES[0], url, `failed api response: = ${JSON.stringify(response)}`, prompt, false, location.href);
            alert(response['fail']);
            throw new Error();
        } else {
            this.reportError(ERROR_SOURCES[0], url, `unexpected api response: = ${JSON.stringify(response)}`, prompt, true, location.href);
            alert('Unexpected response from server');
            throw new Error();
        }
    }


    public deleteData(url: any, data?: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = this.getAbsoluteURL(url, data);
        if (absoluteURL.length > MAX_URL_LENGTH) {
            return this.deleteDataWithPost(url, data);
        }
        return this.http
            .delete(absoluteURL, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from deleteData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from deleteData', false, location.href);
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public deleteDataWithPost(url: any, data?: any) {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = new URL(this.getAbsoluteURL(url)); // only host, no search params
        absoluteURL.searchParams.append('method', 'DELETE');
        absoluteURL.searchParams.append('app_name', data.app_name);
        absoluteURL.searchParams.append('model_name', data.model_name);
        delete data.app_name;
        delete data.model_name;
        let postData;
        if (data && !(data instanceof FormData)) {
            postData = new FormData();
            Object.entries(data).forEach(([key, value]) => postData.append(key, value));
        } else {
            postData = data;
        }
        return this.http
            .post(absoluteURL.toString(), postData, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from deleteDataWithPost');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from deleteDataWithPost', false, location.href);
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public putData(body: any, url: any, params?: { [key: string]: any; }): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .put(this.getAbsoluteURL(url, params), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from putData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from putData', false, location.href, JSON.stringify(body));
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public patchData(body: any, url: any, params?: { [key: string]: any; }): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .patch(this.getAbsoluteURL(url, params), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from patchData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from patchData', false, location.href, JSON.stringify(body));
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public postData(body: any, url: any, params?: { [key: string]: any; }): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .post(this.getAbsoluteURL(url, params), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from postData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from postData', false, location.href, JSON.stringify(body));
                    alert('Error: Action Failed');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public getDataWithPost(url: any, data?: any) {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = new URL(this.getAbsoluteURL(url)); // only host, no search params
        absoluteURL.searchParams.append('method', 'GET');
        absoluteURL.searchParams.append('app_name', data.app_name);
        absoluteURL.searchParams.append('model_name', data.model_name);
        delete data.app_name;
        delete data.model_name;
        let postData;
        if (data && !(data instanceof FormData)) {
            postData = new FormData();
            Object.entries(data).forEach(([key, value]) => postData.append(key, value));
        } else {
            postData = data;
        }
        return this.http
            .post(absoluteURL.toString(), postData, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from getDataWithPost');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from getDataWithPost', false, location.href);
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public getData(url: any, params?: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = this.getAbsoluteURL(url, params);
        if (absoluteURL.length > MAX_URL_LENGTH) {
            return this.getDataWithPost(url, params);
        }
        return this.http
            .get(absoluteURL, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from getData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], location.href, JSON.stringify(error), 'from getData', false, location.href);
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
