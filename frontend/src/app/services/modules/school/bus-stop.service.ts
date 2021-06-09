import { Injectable } from '@angular/core';

import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class BusStopService extends CommonServiceRequirements {
    getBusStopList(data, token: any): Promise<any> {
        const url = '/school/' + data.schoolDbId + '/bus-stops';
        return super.getData(token, url);
    }
}
