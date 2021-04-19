import { Injectable } from '@angular/core';

import { Constants } from '../../classes/constants';
import { environment } from '../../../environments/environment';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataStorage } from '../../classes/data-storage';
import { reportError, ERROR_SOURCES } from './../modules/errors/error-reporting.service';

const MAX_URL_LENGTH = 8000;

@Injectable()
export class RestApiGateway {
    reportError = reportError;

    constructor(private http: HttpClient) {}

    public getToken(): any {
        return DataStorage.getInstance().getUser().jwt;
    }

    getAbsoluteURL(url: string): string {
        let absolute_url = new URL(environment.DJANGO_SERVER + Constants.api_version + url);
        let user = DataStorage.getInstance().getUser();
        if (user.activeSchool) {
            if (user.activeSchool.role === 'Employee') {
                absolute_url.searchParams.append('activeSchoolID', user.activeSchool.dbId);
            } else if (user.activeSchool.role === 'Parent') {
                absolute_url.searchParams.append('activeStudentID', user.activeSchool.studentList.map((s) => s.id).join(','));
            } else {
                alert('Alert: Contact Admin');
            }
        }
        return absolute_url.toString();
    }

    public returnResponse(response: any, url: any = null, prompt: string = null): any {
        const jsonResponse = response.response;
        if (jsonResponse.status === 'success') {
            if (jsonResponse.data) return jsonResponse.data;
            else return jsonResponse.message;
        } else if (jsonResponse.status === 'fail') {
            this.reportError(ERROR_SOURCES[0], url, `failed api response: = ${JSON.stringify(response)}`, prompt);
            alert(jsonResponse.message);
            throw new Error();
        } else {
            this.reportError(ERROR_SOURCES[0], url, `unexpected api response: = ${JSON.stringify(response)}`, prompt, true);
            alert('Unexpected response from server');
            return null;
        }
    }

    public deleteData(url: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .delete(this.getAbsoluteURL(url), { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from deleteData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from deleteData');
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public putData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .put(this.getAbsoluteURL(url), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from putData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from putData');
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public patchData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .patch(this.getAbsoluteURL(url), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from patchData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from patchData');
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public postData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .post(this.getAbsoluteURL(url), body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from postData');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from postData');
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public getDataWithPost(url: any, data?: any) {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        return this.http
            .post(this.getAbsoluteURL(url)+"&method=GET", data, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response, url, 'from getDataWithPost');
                },
                (error) => {
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from getDataWithPost');
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public getData(url: any, params?: any): Promise<any> {
        // check here
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = this.getAbsoluteURL(url);
        console.log(absoluteURL);
        if (absoluteURL.length > MAX_URL_LENGTH || true) {
            console.log('going with get data with post');
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
                    this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from getData');
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
