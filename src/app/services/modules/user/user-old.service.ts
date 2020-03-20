import {Injectable} from '@angular/core';

import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class UserOldService extends CommonServiceRequirements {

    changePassword(data: any, token: any): Promise<any> {
        const url = '/user/change-password';
        return super.postData(data, token, url);
    }

    updateProfile(data: any, token: any): Promise<any> {
        const url = '/user/update-profile';
        return super.postData(data, token, url);
    }

}
