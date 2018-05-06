
import {YEARLY} from './constants';
import {SchoolFeeComponent} from './school-fee-component';

export class FeeDefinition {

    dbId: number = 0;
    feeType: string;
    feeTypeDbId: string;

    orderNumber: number;

    frequency: string = YEARLY;

    locked: boolean = false;

    rte: boolean = true;
    onlyNewStudent: boolean = false;

    classFilter: boolean = false;
    busStopFilter: boolean = false;

    schoolFeeComponentList = [];

    fromServerObject(feeDefinition: any): void {

        this.dbId = feeDefinition.dbId;
        this.feeType = feeDefinition.feeType;
        this.feeTypeDbId = feeDefinition.feeTypeDbId;
        this.frequency = feeDefinition.frequency;
        this.locked = feeDefinition.locked;
        this.rte = feeDefinition.rte;
        this.onlyNewStudent = feeDefinition.onlyNewStudent;
        this.classFilter = feeDefinition.classFilter;
        this.busStopFilter = feeDefinition.busStopFilter;
        this.orderNumber = feeDefinition.orderNumber;

    }

    toServerObject(schoolDbId: number, sessionDbId: number): any {

        let data = {
            'dbId': this.dbId,
            'schoolDbId': schoolDbId,
            'sessionDbId': sessionDbId,
            'feeType': this.feeType,
            'feeTypeDbId': this.feeTypeDbId,
            'frequency': this.frequency,
            'rte': this.rte,
            'onlyNewStudent': this.onlyNewStudent,
            'classFilter': this.classFilter,
            'busStopFilter': this.busStopFilter,
        };

        return data;

    }

}