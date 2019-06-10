import {Injectable} from '@angular/core';



import {RestApiGateway} from "./rest-api-gateway";

@Injectable()
export class ServiceObject extends RestApiGateway {

    protected module_url = '/module';
    protected object_url = '/object';

    // Object
    getObject(object_url: any, data: any): Promise<any> {
        let url = this.module_url+object_url+'?id='+data['id'];
        return super.getData(url);
    }

    getObjectList(object_url: any, data: any): Promise<any> {
        let url = this.module_url+object_url+'/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.getData(url);
    }

    createObject(object_url: any, data: any): Promise<any> {
        return super.postData(data, this.module_url+object_url);
    }

    createObjectList(object_url: any, data: any): Promise<any> {
        return super.postData(data, this.module_url+object_url+'/batch');
    }

    updateObject(object_url: any, data: any): Promise<any> {
        return super.putData(data, this.module_url+object_url);
    }

    updateObjectList(object_url: any, data: any): Promise<any> {
        return super.putData(data, this.module_url+object_url+'/batch');
    }

    partiallyUpdateObject(object_url: any, data: any): Promise<any> {
        return super.patchData(data, this.module_url+object_url);
    }

    partiallyUpdateObjectList(object_url: any, data: any): Promise<any> {
        return super.patchData(data, this.module_url+object_url+'/batch');
    }

    deleteObject(object_url: any, data: any): Promise<any> {
        let url = this.module_url+object_url+'?id='+data['id'];
        return super.deleteData(url);
    }

    deleteObjectList(object_url: any, data: any): Promise<any> {
        let url = this.module_url+object_url+'/batch?id='+data['id'];
        return super.deleteData(url);
    }

}
