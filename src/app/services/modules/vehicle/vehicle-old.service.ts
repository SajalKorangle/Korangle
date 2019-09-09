import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class VehicleOldService extends CommonServiceRequirements {

    // BusStop
    createBusStop(data: any, token: any): Promise<any> {
        const url = '/vehicle/bus-stops';
        return super.postData(data, token, url);
    }

    getBusStopList(data: any, token: any): Promise<any> {
        const url = '/vehicle/school/' + data['parentSchool'] + '/bus-stops';
        return super.getData(token, url);
    }

    updateBusStop(data: any, token: any): Promise<any> {
        const url = '/vehicle/bus-stops/' + data['id'];
        return super.putData(data, token, url);
    }

    deleteBusStop(data: any, token: any): Promise<any> {
        const url = '/vehicle/bus-stops/' + data['id'];
        return super.deleteData(token, url);
    }

}
