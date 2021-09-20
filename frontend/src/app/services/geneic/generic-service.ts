import { Injectable } from '@angular/core';

import { RestApiGateway2 } from './rest-api-gateway-2';

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
export class GenericService extends RestApiGateway2 {

    private getBaseUrl(): string {
        return '/generic';
    }

    createObject<T extends keyof APP_MODEL_STRUCTURE_INTERFACE>(app_name: T, model_name: APP_MODEL_STRUCTURE_INTERFACE[T], data: any): Promise<any> {
        // Object.keys(data).forEach(key => {  // json parse if key ends with JSON
        //     if (key.endsWith("JSON")) {
        //         data[key] = JSON.stringify(data[key]);
        //     }
        // });
        return super.postData(data, this.getBaseUrl(), { app_name, model_name });
        // .then(JSON_OBJECT_RESPONSE_PARSER);
    }

    createObjectList<T extends keyof APP_MODEL_STRUCTURE_INTERFACE>(app_name: T, model_name: APP_MODEL_STRUCTURE_INTERFACE[T], data: any): Promise<any> {

        // if (data.length > 0) { // json parse if key ends with JSON
        //     const jsonKeys = [];
        //     Object.keys(data[0]).forEach(key => {
        //         if (key.endsWith("JSON")) {
        //             jsonKeys.push(key);
        //         }
        //     });
        //     data.forEach(instance => {
        //         jsonKeys.forEach(key => instance[key] = JSON.stringify(instance[key]));
        //     });
        // }
        return super.postData(data, this.getBaseUrl() + '/batch', { app_name, model_name });
        // .then(JSON_OBJECT_LIST_RESPONSE_PARSER);
    }


}

// String in the following string are constant strings and if IDE rename symbol functionality is used all the occurrences can be changed at once
interface APP_MODEL_STRUCTURE_INTERFACE {
    'fees_third_app': 'FeeReceipt' | 'SubFeeReceipt';
}