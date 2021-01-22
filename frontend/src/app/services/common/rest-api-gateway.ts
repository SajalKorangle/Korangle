import {Injectable} from '@angular/core';

import { Constants } from '../../classes/constants';
import { environment } from '../../../environments/environment';

import { HttpHeaders, HttpClient, } from '@angular/common/http';
import {DataStorage} from '../../classes/data-storage';



@Injectable()
export class RestApiGateway {

    constructor(private http: HttpClient) { }

    public getToken(): any {
        return DataStorage.getInstance().getUser().jwt;
    }

    public reportError(url: string, error: any, prompt: string) {
        (<any>window).ga('send', 'exception', {
            'exDescription': JSON.stringify({ from:'RestApiGateway: api error', url, error, prompt }),
            'exFatal': false
        });
        console.log('Error Reported: RestApiGateway');
    }

    public returnResponse(response: any, url:any = null, prompt:string = null): any {
        // const jsonResponse = response.json().response;
        const jsonResponse = response.response;
        if (jsonResponse.status === 'success') {
            if (jsonResponse.data) return jsonResponse.data;
            else return jsonResponse.message;
        } else if (jsonResponse.status === 'fail') {
            (<any>window).ga('send', 'exception', {
                'exDescription': JSON.stringify({ from:'RestApiGateway: failed response', url, response, prompt }),
                'exFatal': false
            });
            console.log('Error Reported: RestApiGateway');
            alert(jsonResponse.message);
            // return null;
            throw new Error();
        } else {
            (<any>window).ga('send', 'exception', {
                'exDescription': JSON.stringify({ from:'RestApiGateway: unexpected response', url, response, prompt }),
                'exFatal': true
            });
            console.log('Error Reported: RestApiGateway');
            alert('Unexpected response from server');
            return null;
        }
    }

    public deleteData(url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.delete(environment.DJANGO_SERVER + Constants.api_version + url, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from deleteData');
            }, error => {
                this.reportError(url, error, 'from deleteData in RAG')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public putData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.put(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from putData');
            }, error => {
                    this.reportError(url, error, 'from putData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public putFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.put(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from putFileData');
            }, error => {
                    this.reportError(url, error, 'from putFileData');
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public patchData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.patch(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from patchData');
            }, error => {
                    this.reportError(url, error, 'from patchData');
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public patchFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.patch(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from patchFileData');
            }, error => {
                    this.reportError(url, error, 'from patchFileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public postData(body: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.post(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from postData');
            }, error => {
                    this.reportError(url, error, 'from postData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public postFileData(body: any, url: any): Promise<any> {
        // const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        return this.http.post(environment.DJANGO_SERVER + Constants.api_version + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from postFileData');
            }, error => {
                    this.reportError(url, error, 'from postFileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public fileData(file: any, url: any): Promise<any> {
        const headers = new HttpHeaders({'Authorization' : 'JWT ' + this.getToken(), 'Accept': 'application/json' });
        let uploadData = new FormData();
        uploadData.append('myFile', file);
        return this.http.post(environment.DJANGO_SERVER + Constants.api_version + url, uploadData, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from fileData');
            }, error => {
                    this.reportError(url, error, 'from fileData')
                alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public getData(url: any, params?: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.getToken() });
        return this.http.get(environment.DJANGO_SERVER + Constants.api_version + url, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response, url, 'from getData');
            }, error => {
                    this.reportError(url, error, 'from getData')
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
