import {Injectable} from '@angular/core';


import {ServiceObject} from "../common/service-object";

@Injectable()
export class UserService extends ServiceObject {

    protected module_url = '/user';

    // objects urls
    public user = '/users';

    // Fee Type
    get(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.getObject(object_url, data);
    }

    getList(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.getObjectList(object_url, data);
    }

    create(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.createObject(object_url, data);
    }

    createList(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.createObjectList(object_url, data);
    }

    update(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.updateObject(object_url, data);
    }

    updateList(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.updateObjectList(object_url, data);
    }

    partiallyUpdate(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.partiallyUpdateObject(object_url, data);
    }

    partiallyUpdateList(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.partiallyUpdateObjectList(object_url, data);
    }

    delete(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.deleteObject(object_url, data);
    }

    deleteList(object_url: any, data: any): Promise<any> {
        this.object_url = object_url;
        return this.deleteObjectList(object_url, data);
    }

}
