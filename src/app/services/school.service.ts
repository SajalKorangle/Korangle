import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class SchoolService extends CommonServiceRequirements {

    getSessionList(token: any): Promise<any> {
        const url = '/school/sessions';
        return super.getData(token, url);
    }

}
