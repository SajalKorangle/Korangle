import { Injectable } from '@angular/core';

import { RestApiGateway } from './rest-api-gateway';

const JSON_OBJECT_RESPOSNE_PARSER = (responseData) => {
    if (responseData) { // json parse if key ends with JSON
        Object.keys(responseData).forEach(key => {
            if (key.endsWith("JSON")) {
                responseData[key] = JSON.parse(responseData[key]);
            }
        });
    }
    return responseData;
};

const JSON_OBJECT_LIST_RESPOSNE_PARSER = (responseData) => {
    if (responseData && responseData.length > 0) { // json parse if key ends with JSON
        const jsonKeys = [];
        Object.keys(responseData[0]).forEach(key => {
            if (key.endsWith("JSON")) {
                jsonKeys.push(key);
            }
        });
        responseData.forEach(instance => {
            jsonKeys.forEach(key => instance[key] = JSON.parse(instance[key]));
        });
    }
    return responseData;
};


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
        return super.getData(url, data).then(JSON_OBJECT_RESPOSNE_PARSER);
    }

    getObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(this.constant_list[object_url]);
        }
        let url = this.module_url + object_url + '/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(url, data).then(JSON_OBJECT_LIST_RESPOSNE_PARSER);
    }

    createObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        Object.keys(data).forEach(key => {  // json parse if key ends with JSON
            if (key.endsWith("JSON")) {
                data[key] = JSON.stringify(data[key]);
            }
        });
        return super.postData(data, this.module_url + object_url).then(JSON_OBJECT_RESPOSNE_PARSER);
    }

    createObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        if (data.length > 0) { // json parse if key ends with JSON
            const jsonKeys = [];
            Object.keys(data[0]).forEach(key => {
                if (key.endsWith("JSON")) {
                    jsonKeys.push(key);
                }
            });
            data.forEach(instance => {
                jsonKeys.forEach(key => instance[key] = JSON.stringify(instance[key]));
            });
        }
        return super.postData(data, this.module_url + object_url + '/batch')
            .then(JSON_OBJECT_LIST_RESPOSNE_PARSER);
    }

    updateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        Object.keys(data).forEach(key => {  // json parse if key ends with JSON
            if (key.endsWith("JSON")) {
                data[key] = JSON.stringify(data[key]);
            }
        });
        return super.putData(data, this.module_url + object_url).then(JSON_OBJECT_RESPOSNE_PARSER);
    }

    updateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        if (data.length > 0) { // json parse if key ends with JSON
            const jsonKeys = [];
            Object.keys(data[0]).forEach(key => {
                if (key.endsWith("JSON")) {
                    jsonKeys.push(key);
                }
            });
            data.forEach(instance => {
                jsonKeys.forEach(key => instance[key] = JSON.stringify(instance[key]));
            });
        }
        return super.putData(data, this.module_url + object_url + '/batch')
            .then(JSON_OBJECT_LIST_RESPOSNE_PARSER);
    }

    partiallyUpdateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        Object.keys(data).forEach(key => {  // json parse if key ends with JSON
            if (key.endsWith("JSON")) {
                data[key] = JSON.stringify(data[key]);
            }
        });
        return super.patchData(data, this.module_url + object_url).then(JSON_OBJECT_RESPOSNE_PARSER);
    }

    partiallyUpdateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        if (data.length > 0) { // json parse if key ends with JSON
            const jsonKeys = [];
            Object.keys(data[0]).forEach(key => {
                if (key.endsWith("JSON")) {
                    jsonKeys.push(key);
                }
            });
            data.forEach(instance => {
                jsonKeys.forEach(key => instance[key] = JSON.stringify(instance[key]));
            });
        }
        return super.patchData(data, this.module_url + object_url + '/batch')
            .then(JSON_OBJECT_LIST_RESPOSNE_PARSER);
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
