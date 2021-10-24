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
        return '/generic';
    }

    parseConfig(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>): [string, string] {
        if (Object.entries(config).length != 1) {
            throw new Error("Invalid APP NAME, MODEL NAME pair");
        }
        return Object.entries(config)[0];
    }

    getObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.getData(this.getBaseUrl(), { app_name, model_name, __data__: JSON.stringify(DataView) });
    }

    getObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.getData(this.getBaseUrl() + '/batch', { app_name, model_name, __data__: JSON.stringify(DataView) });
    }

    createObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.postData(data, this.getBaseUrl(), { app_name, model_name });
    }

    createObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        return super.postData(data, this.getBaseUrl() + '/batch', { app_name, model_name });
    }


}



interface APP_MODEL_STRUCTURE_INTERFACE {
    fees_third_app: 'FeeReceipt' | 'SubFeeReceipt' | 'Discount' | 'SubDiscount' | 'FeeReceiptOrder';
    accounts_app: 'Transaction' | 'TransactionAccountDetails';
};

// APP_MODEL_STRUCTURE_INTERFACE