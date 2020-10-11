import {Injectable} from '@angular/core';

import { API_LIST } from '@mock-api/api-list';
import {ApiVersion} from '@mock-api/api-version';


@Injectable()
export class MockServiceObject {

    public app_url = '';

    getModelVersion(url: any): any {
        return API_LIST.find(item => {
            return item.url === url;
        }).version_list.find(item => {
            return item.version[url] === ApiVersion.getInstance().getVersion()[url];
        }).list;
    }

    // Object
    getObject(object_url: any, data: any): Promise<any> {
        return Promise.resolve(
            this.getModelVersion(this.app_url + object_url).forEach(item => {
                return item.id === data['id'];
            })
        );
    }

    getObjectList(object_url: any, data: any): Promise<any> {
        return Promise.resolve(this.getModelVersion(this.app_url + object_url));
    }

    createObject(object_url: any, data: any): Promise<any> {
        return Promise.resolve({
            ...data,
            id: Math.max(...this.getModelVersion(this.app_url + object_url).map(item => item.id)) + 1
        });
    }

    createObjectList(object_url: any, data: any): Promise<any> {
        let tempId = Math.max(...this.getModelVersion(this.app_url + object_url).map(item => item.id));
        data.forEach(item => {
            tempId = tempId + 1;
            item['id'] = tempId;
        });
        return Promise.resolve(data);
    }

    updateObject(object_url: any, data: any): Promise<any> {
        return Promise.resolve({
            ...this.getModelVersion(this.app_url + object_url).find(item => item.id === data.id),
            ...data
        });
    }

    updateObjectList(object_url: any, data: any): Promise<any> {
        const data_list = this.getModelVersion(this.app_url + object_url);
        data.forEach(item => {
            const data_list_item = data_list.find(itemTwo => {
                return itemTwo.id === item.id;
            });
            item = {...data_list_item, ...item};
        });
        return Promise.resolve(data);
    }

    partiallyUpdateObject(object_url: any, data: any): Promise<any> {
        return Promise.resolve({
            ...this.getModelVersion(this.app_url + object_url).find(item => item.id === data.id),
            ...data
        });
    }

    partiallyUpdateObjectList(object_url: any, data: any): Promise<any> {
        const data_list = this.getModelVersion(this.app_url + object_url);
        data.forEach(item => {
            const data_list_item = data_list.find(itemTwo => {
                return itemTwo.id === item.id;
            });
            item = {...data_list_item, ...item};
        });
        return Promise.resolve(data);
    }

    deleteObject(object_url: any, data: any): Promise<any> {
        return Promise.resolve(data['id']);
    }

    deleteObjectList(object_url: any, data: any): Promise<any> {
        return Promise.resolve(0);
    }

}
