import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class FeeService extends ServiceObject {
    protected module_url = '/fees';

    // objects urls
    public fee_type = '/fee-types';
    public school_fee_rules = '/school-fee-rules';
    public class_filter_fees = '/class-filter-fees';
    public bus_stop_filter_fees = '/bus-stop-filter-fees';
    public student_fees = '/student-fees';
    public fee_receipts = '/fee-receipts';
    public sub_fee_receipts = '/sub-fee-receipts';
    public discounts = '/discounts';
    public sub_discounts = '/sub-discounts';
    public fee_features = '/fee-features';
    public parent_transaction = '/parent-transaction';
    public online_payment_account = '/online-payment-account';
    public fee_settings = '/fee-settings';
    public settelment_cycle = '/cashfree/settelment-cycle';


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
