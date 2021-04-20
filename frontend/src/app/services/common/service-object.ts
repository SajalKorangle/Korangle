import { Injectable } from '@angular/core';

import { RestApiGateway } from './rest-api-gateway';

@Injectable()
export class ServiceObject extends RestApiGateway {
    protected module_url = '/module';
    protected object_url = '/object';

    protected constant_list = {};

    // Object
    getObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        let url = this.module_url + object_url + '?';
        let searchParams = new URLSearchParams();
        Object.entries(data).forEach(([key, value]: [string, string]) => searchParams.append(key, value));
        url = url + searchParams.toString();
        return super.getData(url, data);
    }

    getObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(this.constant_list[object_url]);
        }
        let url = this.module_url + object_url + '/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(url, data);
    }

    createObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.postData(data, this.module_url + object_url);
    }

    createObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.postData(data, this.module_url + object_url + '/batch');
    }

    updateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.putData(data, this.module_url + object_url);
    }

    updateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.putData(data, this.module_url + object_url + '/batch');
    }

    partiallyUpdateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.patchData(data, this.module_url + object_url);
    }

    partiallyUpdateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        return super.patchData(data, this.module_url + object_url + '/batch');
    }

    deleteObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        const url = this.module_url + object_url + '?id=' + data['id'];
        return super.deleteData(url);
    }

    deleteObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        let url = this.module_url + object_url + '/batch?e=';
        Object.keys(data).forEach((key) => {
            url += '&' + key + '=' + data[key];
        });
        return super.deleteData(url);
    }
}
