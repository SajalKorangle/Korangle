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

    isAppConstant(app_name: string, model_name: string) {
        if (app_name in APP_CONSTANTS && model_name in APP_CONSTANTS[app_name]) {
            return true;
        }
        return false;
    }

    getObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.getData(this.getBaseUrl(), { app_name, model_name, __query__: JSON.stringify(query) });
    }

    async getObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);

        let url = this.getBaseUrl() + 'batch' + JSON.stringify({ app_name, model_name, __query__: JSON.stringify(query) });
        if (app_name in APP_CONSTANTS
            && model_name in APP_CONSTANTS[app_name]) {
            if (url in APP_CONSTANTS[app_name][model_name]) {
                return Promise.resolve(APP_CONSTANTS[app_name][model_name][url]);
            } else {
                APP_CONSTANTS[app_name][model_name][url] =
                    await super.getData(this.getBaseUrl() + 'batch', { app_name, model_name, __query__: JSON.stringify(query) });
                return Promise.resolve(APP_CONSTANTS[app_name][model_name][url]);
            }
        }

        return super.getData(this.getBaseUrl() + 'batch', { app_name, model_name, __query__: JSON.stringify(query) });
    }

    createObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.postData(data, this.getBaseUrl(), { app_name, model_name });
    }

    createObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.postData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    updateObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.putData(data, this.getBaseUrl(), { app_name, model_name });
    }

    updateObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.putData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    partiallyUpdateObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.patchData(data, this.getBaseUrl(), { app_name, model_name });
    }

    partiallyUpdateObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.patchData(data, this.getBaseUrl() + 'batch', { app_name, model_name });
    }

    // deleteObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: any): Promise<any> {
    //     const [app_name, model_name] = this.parseConfig(config);
    //     if(app_name in CONSTANTS){
    //         if(model_name in CONSTANTS[app_name]) {
    //             return Promise.resolve(null);
    //         }
    //     }
    //     return super.getData(this.getBaseUrl(), { app_name, model_name, __query__: JSON.stringify(query) });
    // }

    deleteObjectList(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: QUERY_INTERFACE): Promise<any> {
        const [app_name, model_name] = this.parseConfig(config);
        if (this.isAppConstant(app_name, model_name)) {
            return Promise.resolve(null);
        }
        return super.deleteData(this.getBaseUrl() + 'batch', { app_name, model_name, __query__: JSON.stringify(query) });
    }

}

export interface APP_MODEL_STRUCTURE_INTERFACE {
    leaves_app: 'SchoolLeaveType' | 'SchoolLeaveTypeMonth';
    fees_third_app: 'FeeReceipt' | 'SubFeeReceipt' | 'Discount' | 'SubDiscount' | 'FeeReceiptOrder' | 'StudentFee' | 'FeeSchoolSettings' | 'ViewDefaulterPermissions';
    accounts_app: 'Transaction' | 'TransactionAccountDetails';
    payment_app: 'SchoolMerchantAccount' | 'SchoolBankAccountUpdationPermissionCount' | 'Order' | 'CashfreeDailyJobsReport'
        | 'PaymentGateway' | 'ModeOfPayment' | 'ModeOfPaymentCharges';
    activity_record_app: 'ActivityRecord';
    student_app: 'Student' | 'StudentSection' | 'StudentParameter' | 'StudentParameterValue' | 'CountAllTable';
    class_app: 'Class' | 'Division';
    school_app: 'Session' | 'BusStop' | 'School';
    tc_app: 'TransferCertificateNew';
    subject_app: 'StudentSubject' | 'SubjectSecond';
    examination_app: 'Examination' | 'StudentTest' | 'StudentExtraSubField' | 'CCEMarks';
    sms_app: 'SMSId' | 'SMSIdSchool' | 'SMSTemplate' | 'SMSEventSettings';
    complaints_app: 'SchoolComplaintType' | 'SchoolComplaintStatus' | 'StatusComplaintType' | 'Complaint' | 'Comment' | 'EmployeeComplaintType' | 'EmployeeComplaint' | 'CountAllComplaints';
    employee_app: 'Employee' | 'EmployeePermission' | 'EmployeeParameter';
    team_app: 'Module' | 'Task';
    authentication_app: 'DeviceList';
    notification_app: 'Notification';
    user_app: 'User';
    attendance_app: 'AttendancePermission';
}

export const APP_CONSTANTS = {
    class_app: {
        Class: {},
        Division: {},
    },
    school_app: {
        Session: {},
        Board: {},
    }
};

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
            exclude?: FILTER_TYPE,
        };
    };
    order_by?: Array<string>;
    pagination?: {
        start: number,
        end: number,
    };
}
