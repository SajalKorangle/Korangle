import {Injectable} from '@angular/core';

import { Constants } from '../../classes/constants';
import { environment } from '../../../environments/environment';

import { HttpHeaders, HttpClient, } from '@angular/common/http';
import {DataStorage} from '../../classes/data-storage';
import { reportError, ERROR_SOURCES } from './../modules/errors/error-reporting.service';


@Injectable()
export class RestApiGateway {

    reportError = reportError;

    constructor(private http: HttpClient) { }

    public getToken(): any {
        return DataStorage.getInstance().getUser().jwt;
    }

    getAbsoluteURL(url: string): string{
        let absolute_url = new URL(environment.DJANGO_SERVER + Constants.api_version + url);
        let user = DataStorage.getInstance().getUser();
        if (user.activeSchool) {
            if (user.activeSchool.role === 'Employee') {
                absolute_url.searchParams.append('activeSchoolID', user.activeSchool.dbId);
            } else if (user.activeSchool.role === 'Parent') {
                absolute_url.searchParams.append('activeStudentID', user.activeSchool.studentList.map(s=>s.id).join(','));
            } else {
                alert('Alert: Contact Admin');
            }
        }
        return absolute_url.toString()
    }

    public returnResponse(response: any, url:any = null, prompt:string = null): any {
        // const jsonResponse = response.json().response;
        const jsonResponse = response.response;
        if (jsonResponse.status === 'success') {
            if (jsonResponse.data) return jsonResponse.data;
            else return jsonResponse.message;
        } else if (jsonResponse.status === 'fail') {
            this.reportError(ERROR_SOURCES[0], url, `failed api response: = ${response}`, prompt);
            alert(jsonResponse.message);
            // return null;
            throw new Error();
        } else {
            this.reportError(ERROR_SOURCES[0], url, `unexpected api response: = ${response}`, prompt, true);
            alert('Unexpected response from server');
            return null;
        }
    }

    public deleteData(url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.delete(this.getAbsoluteURL(url), {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from deleteData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from deleteData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public putData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.put(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from putData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from putData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public putFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.put(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from putFileData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from putFileData');
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public patchData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.patch(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from patchData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from patchData');
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public patchFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.patch(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from patchFileData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from patchFileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public postData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.post(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from postData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from postData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public postFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.post(this.getAbsoluteURL(url), body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from postFileData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from postFileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public fileData(file: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        let uploadData = new FormData();
        uploadData.append('myFile', file);
        return this.http.post(this.getAbsoluteURL(url), uploadData, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from fileData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from fileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public getData(url: any, params?: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.getToken()});
        return this.http.get(this.getAbsoluteURL(url), {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from getData');
            }, error => {
                this.reportError(ERROR_SOURCES[0], url, JSON.stringify(error), 'from getData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
