import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class SchoolService extends CommonServiceRequirements {

    getSessionList(token: any): Promise<any> {
        return super.getData(token, '/school/sessions');
    }

    updateSchoolProfile(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/school/' + data['dbId']);
    }

}
