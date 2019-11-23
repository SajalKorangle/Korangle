import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class SchoolOldService extends CommonServiceRequirements {

    getSessionList(token: any): Promise<any> {
        return super.getData(token, '/school/sessions');
    }

    updateSchoolProfile(data: any, token: any): Promise<any> {
        console.log(data);
        return super.putData(data, token, '/school/' + data['dbId']);
    }

    uploadProfileImage(file: any, data: any, token: any): Promise<any> {
        return super.fileData(file, token, '/school/' + data['dbId'] + '/profile-image');
    }

    uploadPrincipalSignatureImage(file: any, data: any, token: any): Promise<any> {
        return super.fileData(file, token, '/school/' + data['dbId'] + '/principal-signature-image');
    }

    createSchoolProfile(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/school/school-profile');
    }

}
