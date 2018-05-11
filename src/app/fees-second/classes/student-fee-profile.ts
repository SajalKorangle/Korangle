

import {FREQUENCY_LIST} from './constants';

export class StudentFeeProfile {

    // Total Fee
    static getStudentTotalFee(studentFeeProfile: any): number {
        let amount = 0;
        studentFeeProfile.sessionFeeStatusList.forEach(sessionFeeStatus => {
            if (StudentFeeProfile.getSessionFeesDue(sessionFeeStatus) > 0) {
                amount += StudentFeeProfile.getSessionTotalFee(sessionFeeStatus);
            }
        });
        return amount;
    }

    static getSessionTotalFee(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += StudentFeeProfile.getComponentTotalFee(component);
        });
        return amount;
    }

    static getComponentTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amount += component.amount;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                amount += StudentFeeProfile.getComponentMonthlyTotalFee(componentMonthly);
            });
        }
        return amount;
    }

    static getComponentMonthlyTotalFee(componentMonthly: any): number {
        return componentMonthly.amount;
    }

    
    // Fees Due
    static getStudentFeesDue(studentFeeProfile: any): number {
        let amountDue = 0;
        studentFeeProfile.sessionFeeStatusList.forEach(sessionFeeStatus => {
            amountDue += StudentFeeProfile.getSessionFeesDue(sessionFeeStatus);
        });
        return amountDue;
    }

    static getSessionFeesDue(sessionFeeStatus: any): number {
        let amountDue = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amountDue += StudentFeeProfile.getComponentFeesDue(component);
        });
        return amountDue;
    }

    static getComponentFeesDue(component: any): number {
        let amountDue = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amountDue += component.amountDue;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                amountDue += StudentFeeProfile.getComponentMonthlyFeesDue(componentMonthly);
            });
        }
        return amountDue;
    }

    static getComponentMonthlyFeesDue(componentMonthly: any): number {
        return componentMonthly.amountDue;
    }

}