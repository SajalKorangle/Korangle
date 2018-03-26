import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../services/common-service-requirements';

@Injectable()
export class SchoolService extends CommonServiceRequirements {

    /* Update School Profile */
    updateSchoolProfile(data: any, token: any): Promise<any> {
        const url = '/school/' + data.urlData.schoolDbId;
        const postData = data.postData;
        return super.postData(postData, token, url);
    }

}
