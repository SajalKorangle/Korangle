import { Injectable } from '@angular/core';

import { Constants } from '../../classes/constants';
import { environment } from '../../../environments/environment';

import { HttpHeaders, HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DataStorage } from '../../classes/data-storage';
import { reportError, ERROR_SOURCES } from '../modules/errors/error-reporting.service';
import { MatDialog } from '@angular/material';

import { ManageAllComplaintsComponent } from '@modules/parent-support/pages/manage-all-complaints/manage-all-complaints.component';
// import { ManageAllComplaintsServiceAdapter } from '@modules/parent-support/pages/manage-all-complaints/manage-all-complaints.service.adapter';

const MAX_URL_LENGTH = 2048;

@Injectable()
export class RestApiGateway {
    reportError = reportError;

    // manageAllComplaintsServiceAdapter: ManageAllComplaintsServiceAdapter;
    manageAllComplaintsComponent: ManageAllComplaintsComponent;
    dialog: MatDialog;

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

    // public getData(url: any, params?: any): Promise<any> {
    //     const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
    //     const absoluteURL = this.getAbsoluteURL(url, params);
    //     if (absoluteURL.length > MAX_URL_LENGTH) {
    //         return this.getDataWithPost(url, params);
    //     }
    //     return this.http
    //         .get(absoluteURL, { headers: headers })
    //         .toPromise()
    //         .then(
    //             (response) => {
    //                 return this.returnResponse(response, url, 'from getData');
    //             },
    //             (error) => {
    //                 this.reportError(ERROR_SOURCES[0], location.href, JSON.stringify(error), 'from getData', false, location.href);
    //                 alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
    //                 return null;
    //             }
    //         )
    //         .catch(this.handleError);
    // }

    public getData(url: any, params?: any): Promise<any> {
        const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
        const absoluteURL = this.getAbsoluteURL(url, params);
        if (absoluteURL.length > MAX_URL_LENGTH) {
            return this.getDataWithPost(url, params);
        }

        const req = new HttpRequest('GET', absoluteURL, {
            reportProgress: true,
            headers: headers
        });

        return this.http.request(req)
                .pipe(
                    map(event => this.getEventMessage(event, params)),
                    catchError(this.handleError)
                )
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

    private getEventMessage(event: HttpEvent<any>, params) {
        let returnData = {};

        if (event.type === HttpEventType.DownloadProgress) {
            const percentDone = Math.round(100 * event.loaded / (event.total));
            returnData["percentDone"] = percentDone;
            if(params["model_name"] == "Complaint") {
                // this.manageAllComplaintsServiceAdapter = new ManageAllComplaintsServiceAdapter();
                // console.log("manageAllComplaintsServiceAdapter: ", this.manageAllComplaintsServiceAdapter);
                this.manageAllComplaintsComponent = new ManageAllComplaintsComponent(this.dialog);
                this.manageAllComplaintsComponent.setProgress(percentDone);
            }
        }

        if (event.type === HttpEventType.Response) {
            returnData["success"] = event.body["success"];
        }
        return returnData;
    }

    // public getData(url: any, params?: any) {
    //     const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
    //     const absoluteURL = this.getAbsoluteURL(url, params);
    //     if (absoluteURL.length > MAX_URL_LENGTH) {
    //         return this.getDataWithPost(url, params);
    //     }
    //
    //     const req = new HttpRequest('GET', absoluteURL, {
    //          reportProgress: true,
    //          headers: headers
    //     });
    //
    //     let output: any;
    //     this.http.request(req).pipe(
    //         map(event => this.getEventMessage(event)),
    //         catchError(this.handleError)
    //     ).subscribe((element) => {
    //         output = element;
    //     });
    //
    //     console.log("Output: ", output);
    //     return output;
    //
    //     // if(data["data"]) {
    //     //     return data;
    //     // }
    //         // let data = [];
    //         // this.http.request(req).subscribe((event: HttpEvent<any>) => {
    //         //     switch (event.type) {
    //         //         case HttpEventType.Sent:
    //         //             console.log('Request sent!');
    //         //             break;
    //         //         case HttpEventType.ResponseHeader:
    //         //             console.log('Response header received!');
    //         //             break;
    //         //         case HttpEventType.DownloadProgress:
    //         //             const percentDone = Math.round(100 * event.loaded / (event.total));
    //         //             console.log("Progress: ", percentDone);
    //         //             break;
    //         //         case HttpEventType.Response:
    //         //             data = event.body["success"];
    //         //       }
    //         //       console.log("Data: ", data);
    //         // });
    //         //
    //         // if(data.length) {
    //         //     return data;
    //         // }
    //
    //     // return this.http
    //     //     .get(absoluteURL, { responseType: "blob", reportProgress: true, observe: "events", headers: headers })
    //     //     .pipe(
    //     //         map(event => this.getEventMessage(event)),
    //     //         tap(data => this.showProgress(data)),
    //     //         last(),
    //     //         catchError(this.handleError)
    //     //     );
    //
    //
    //         // .subscribe(event => {
    //         //     console.log("Event: ", event);
    //         //     if (event.type === HttpEventType.DownloadProgress) {
    //         //         console.log("download progress");
    //         //     }
    //         //     if (event.type === HttpEventType.Response) {
    //         //         console.log("donwload completed");
    //         //     }
    //         // });
    // }

    // public getData(url: any, params?: any): Promise<any> {
    //     const headers = new HttpHeaders({ Authorization: 'JWT ' + this.getToken() });
    //     const absoluteURL = this.getAbsoluteURL(url, params);
    //     if (absoluteURL.length > MAX_URL_LENGTH) {
    //         return this.getDataWithPost(url, params);
    //     }
    //
    //     return this.http
    //             .get(absoluteURL, { reportProgress: true, headers: headers })
    //             .toPromise()
    //             .then(
    //                 (response) => {
    //                     return this.returnResponse(response, url, 'from getData');
    //                 },
    //                 (error) => {
    //                     this.reportError(ERROR_SOURCES[0], location.href, JSON.stringify(error), 'from getData', false, location.href);
    //                     alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
    //                     return null;
    //                 }
    //             )
    //             .catch(this.handleError);
    //
    //     // const req = new HttpRequest('GET', absoluteURL, {
    //     //      reportProgress: true,
    //     //      headers: headers
    //     // });
    //
    //     // return this.http.request(req).subscribe((event: HttpEvent<any>) => {
    //     //     let data = [];
    //     //     switch (event.type) {
    //     //         case HttpEventType.Sent:
    //     //             console.log('Request sent!');
    //     //             break;
    //     //         case HttpEventType.ResponseHeader:
    //     //             console.log('Response header received!');
    //     //             break;
    //     //         case HttpEventType.DownloadProgress:
    //     //             const percentDone = Math.round(100 * event.loaded / (event.total));
    //     //             console.log("Progress: ", percentDone);
    //     //             break;
    //     //         case HttpEventType.Response:
    //     //             data = event.body["success"];
    //     //       }
    //     //       console.log("Data: ", data);
    //     //       return data;
    //     // });
    //
    //     // return this.http.request(req).pipe(
    //     //     map(event => this.getEventMessage(event)),
    //     //     tap(data => data),
    //     //     last(),
    //     //     catchError(this.handleError)
    //     // );
    // }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
