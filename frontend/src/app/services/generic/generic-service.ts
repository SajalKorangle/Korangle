import { Injectable } from '@angular/core';

import { RestApiGateway } from './rest-api-gateway';

// const JSON_OBJECT_RESPONSE_PARSER = (responseData) => {
//     if (responseData) { // json parse if key ends with JSON
//         Object.keys(responseData).forEach(key => {
//             if (key.endsWith("JSON")) {
//                 responseData[key] = JSON.parse(responseData[key]);
//             }
//         });
//     }
//     return responseData;
// };

// const JSON_OBJECT_LIST_RESPONSE_PARSER = (responseData) => {
//     if (responseData && responseData.length > 0) { // json parse if key ends with JSON
//         const jsonKeys = [];
//         Object.keys(responseData[0]).forEach(key => {
//             if (key.endsWith("JSON")) {
//                 jsonKeys.push(key);
//             }
//         });
//         responseData.forEach(instance => {
//             jsonKeys.forEach(key => instance[key] = JSON.parse(instance[key]));
//         });
//     }
//     return responseData;
// };


@Injectable()
export class GenericService extends RestApiGateway {

    private getBaseUrl(): string {
        return '/generic/';
    }

    parseConfig(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>): [string, string] {
        if (Object.entries(config).length != 1) {
            throw new Error("Invalid APP NAME, MODEL NAME pair");
        }
        return Object.entries(config)[0];
    }

    getObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.getData(this.getBaseUrl(), { app_name, model_name, __query__: JSON.stringify(query) });
    }

    getObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.getData(this.getBaseUrl() + 'batch', { app_name, model_name, __query__: JSON.stringify(query) });
    }

    createObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.postData(data, this.getBaseUrl(), { app_name, model_name });
    }

    createObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.postData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    updateObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.putData(data, this.getBaseUrl(), { app_name, model_name });
    }

    updateObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.putData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    partiallyUpdateObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.patchData(data, this.getBaseUrl(), { app_name, model_name });
    }

    partiallyUpdateObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.patchData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    // deleteObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: any): Promise<any> {
    //     const [app_name, model_name] = this.parseConfig(config);
    //     return super.getData(this.getBaseUrl(), { app_name, model_name, __query__: JSON.stringify(query) });
    // }

    deleteObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.deleteData(this.getBaseUrl() + 'batch', { app_name, model_name, __query__: JSON.stringify(query) });
    }

}



export interface APP_MODEL_STRUCTURE_INTERFACE {
    fees_third_app: 'FeeReceipt' | 'SubFeeReceipt' | 'Discount' | 'SubDiscount' | 'FeeReceiptOrder';
    accounts_app: 'Transaction' | 'TransactionAccountDetails';
    student_app: 'Student' | 'StudentSection';
    sms_app: 'SMSId' | 'SMSIdSchool' | 'SMSTemplate' | 'SMSEventSettings';
    payment_app: 'SchoolMerchantAccount' | 'SchoolBankAccountUpdationPermissionCount' | 'Order' | 'CashfreeDailyJobsReport';
    employee_app: 'Employee' | 'EmployeePermission' | 'EmployeeParameter';
    team_app: 'Module' | 'Task';
}

// APP_MODEL_STRUCTURE_INTERFACE

export type FILTER_TYPE = { [key: string]: any, __or__?: Array<FILTER_TYPE>; };

export interface QUERY_INTERFACE {
    fields_list?: Array<string | '__all__'>;
    parent_query?: { [key: string]: QUERY_INTERFACE };
    child_query?: { [key: string]: QUERY_INTERFACE };
    filter?: FILTER_TYPE;
    exclude?: FILTER_TYPE;
    union?: Array<QUERY_INTERFACE>;
    annotate?: {
        [key: string]: {
            field: string,
            function: string,
            filter?: FILTER_TYPE,
        };
    };
    order_by?: Array<string>;
    pagination?: {
        start: number,
        end: number,
    };
}
