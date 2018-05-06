
import {AmountFrequency} from './amount-frequency';
import {MONTHLY, YEARLY} from './constants';

export class SchoolFeeComponent {

    dbId: number = 0;
    parentFeeDefinition: any;
    title: string;

    amountFrequency: AmountFrequency = new AmountFrequency();

    classList: any = [];

    busStopList: any = [];

    disabledList: any = [];

    constructor(feeDefinition: any, classList: any, busStopList: any) {
        this.parentFeeDefinition = feeDefinition;
        classList.forEach(classs => {
            let tempClass = {
                'dbId': classs.dbId,
                'name': classs.name,
                'selected': false,
                'disabled': false,
                'title': '',
            };
            this.classList.push(tempClass);
        });
        busStopList.forEach(busStop => {
            let tempBusStop = {
                'dbId': busStop.dbId,
                'stopName': busStop.stopName,
                'selected': false,
                'disabled': false,
                'title': '',
            };
            this.busStopList.push(tempBusStop);
        });
        this.updateDisabled();
    }

    updateDisabled(): void {
        if (this.parentFeeDefinition.classFilter && !this.parentFeeDefinition.busStopFilter) {
            this.parentFeeDefinition.schoolFeeComponentList.forEach( schoolFeeComponent => {
                schoolFeeComponent.classList.forEach( classs => {
                    this.setClassKeyValue(classs, 'disabled', true);
                });
            });
        } else if (!this.parentFeeDefinition.classFilter && this.parentFeeDefinition.busStopFilter) {
            this.parentFeeDefinition.schoolFeeComponentList.forEach( schoolFeeComponent => {
                schoolFeeComponent.busStopList.forEach( busStop => {
                    this.setBusStopKeyValue(busStop, 'disabled', true);
                });
            });
        } else if (this.parentFeeDefinition.classFilter && this.parentFeeDefinition.busStopFilter) {
            this.updateClassDisabled();
            this.updateBusStopDisabled();
        }
    }

    updateClassDisabled(): void {
        this.classList.forEach(classs => {
            if (!classs.selected) {
                classs.disabled = false;
                classs.title = '';
                this.busStopList.forEach(busStop => {
                    if (busStop.selected) {
                        if (this.classBusStopAlreadyExist(classs, busStop)) {
                            classs.disabled = true;
                            classs.title = 'Already exist for ' + busStop.stopName;
                        }
                    }
                });
            }
        })
    }

    updateBusStopDisabled(): void {
        this.busStopList.forEach(busStop => {
            if (!busStop.selected) {
                busStop.disabled = false;
                busStop.title = '';
                this.classList.forEach(classs => {
                    if (classs.selected) {
                        if (this.classBusStopAlreadyExist(classs, busStop)) {
                            busStop.disabled = true;
                            busStop.title = 'Already exist for ' + classs.name;
                        }
                    }
                });
            }
        })
    }

    classBusStopAlreadyExist(classs, busStop): boolean {
        let exist = false;
        this.parentFeeDefinition.schoolFeeComponentList.every(schoolFeeComponent => {
            schoolFeeComponent.classList.every(tempClass => {
                if (tempClass.dbId === classs.dbId) {
                    schoolFeeComponent.busStopList.every(tempBusStop => {
                        if (busStop.dbId === tempBusStop.dbId) {
                            exist = true;
                            return false;
                        }
                        return true;
                    });
                    return false;
                }
                return true;
            });
            if (exist) {
                return false;
            }
            return true;
        });
        return exist;
    }

    setClassKeyValue(classs: any, key: string, value: any): void {
        this.classList.every(tempClasss => {
            if (tempClasss.dbId === classs.dbId) {
                tempClasss[key] = value;
                return false;
            }
            return true;
        });
    }

    setBusStopKeyValue(busStop: any, key: string, value: any): void {
        this.busStopList.every(tempBusStop => {
            if (tempBusStop.dbId === busStop.dbId) {
                tempBusStop[key] = value;
                return false;
            }
            return true;
        });
    }

    fromServerObject(schoolFeeComponent: any): void {
        this.dbId = schoolFeeComponent.dbId;
        this.title = schoolFeeComponent.title;
        if (this.parentFeeDefinition.frequency === MONTHLY) {
            this.amountFrequency.monthAmountList = [];
            schoolFeeComponent.monthList.forEach(month => {
                let tempMonth = {};
                tempMonth['month'] = month.month;
                tempMonth['amount'] = month.amount;
                this.amountFrequency.monthAmountList.push(tempMonth);
            });
        } else if (this.parentFeeDefinition.frequency === YEARLY) {
            this.amountFrequency.annualAmount = schoolFeeComponent.amount;
        }
        if (this.parentFeeDefinition.classFilter) {
            schoolFeeComponent.classList.forEach( classs => {
                this.setClassKeyValue(classs, 'selected', true);
            });
        }
        if (this.parentFeeDefinition.busStopFilter) {
            schoolFeeComponent.busStopList.forEach( busStop => {
                this.setBusStopKeyValue(busStop, 'selected', true);
            });
        }
    }

    toServerObject(): any {
        let data = {
            'dbId': this.dbId,
            'feeDefinitionDbId': this.parentFeeDefinition.dbId,
            'title': this.title,
        };
        if (this.parentFeeDefinition.frequency === MONTHLY) {
            data['monthList'] = [];
            this.amountFrequency.monthAmountList.forEach( month => {
                let tempMonth = {
                    'month': month.month,
                    'amount': (!month.amount?0:month.amount),
                };
                data['monthList'].push(tempMonth);
            });
        } else if (this.parentFeeDefinition.frequency === YEARLY) {
            data['amount'] = (!this.amountFrequency.annualAmount?0:this.amountFrequency.annualAmount);
        }
        if (this.parentFeeDefinition.classFilter) {
            data['classList'] = [];
            this.classList.forEach(classs => {
                if (classs.selected === true) {
                    let tempClass = {
                        'dbId': classs.dbId,
                        'name': classs.name,
                    };
                    data['classList'].push(tempClass);
                }
            });
        }
        if (this.parentFeeDefinition.busStopFilter) {
            data['busStopList'] = [];
            this.busStopList.forEach(busStop => {
                if (busStop.selected === true) {
                    let tempBusStop = {
                        'dbId': busStop.dbId,
                        'stopName': busStop.stopName,
                    };
                    data['busStopList'].push(tempBusStop);
                }
            });
        }
        return data;
    }

}