import {Injectable} from '@angular/core';



import {RestApiGateway} from "./rest-api-gateway";

@Injectable()
export class ServiceObject extends RestApiGateway {

    protected module_url = '/module';
    protected object_url = '/object';

    protected constant_list = {};
    protected file_list = {};

    // Object
    getObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        let url = this.module_url+object_url+'?id='+data['id'];
        return super.getData(url);
    }

    getObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(this.constant_list[object_url]);
        }
        let url = this.module_url+object_url+'/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.getData(url);
    }

    createObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.postFileData(data, this.module_url+object_url);
        }
        return super.postData(data, this.module_url+object_url);
    }

    createObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.postFileData(data, this.module_url+object_url+'/batch');
        }
        return super.postData(data, this.module_url+object_url+'/batch');
    }

    updateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.putFileData(data, this.module_url+object_url);
        }
        return super.putData(data, this.module_url+object_url);
    }

    updateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.putFileData(data, this.module_url+object_url+'/batch');
        }
        return super.putData(data, this.module_url+object_url+'/batch');
    }

    partiallyUpdateObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.patchFileData(data, this.module_url+object_url);
        }
        return super.patchData(data, this.module_url+object_url);
    }

    partiallyUpdateObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        } else if (object_url in this.file_list) {
            return super.patchFileData(data, this.module_url+object_url+'/batch');
        }
        return super.patchData(data, this.module_url+object_url+'/batch');
    }

    deleteObject(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        let url = this.module_url+object_url+'?id='+data['id'];
        return super.deleteData(url);
    }

    deleteObjectList(object_url: any, data: any): Promise<any> {
        if (object_url in this.constant_list) {
            return Promise.resolve(null);
        }
        let url = this.module_url+object_url+'/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.deleteData(url);
    }

}
