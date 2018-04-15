import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../services/common-service-requirements';

import { URLSearchParams } from '@angular/http';

@Injectable()
export class FeeService extends CommonServiceRequirements {

    getStudentFeeStatus(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-status');
    }

}
