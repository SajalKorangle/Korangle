export const SMS_CHARGE = 0.3;

export function getDefaultSMSPlans() {
    const SMS_PLAN = [
        { noOfSms: 5000, selected: false },
        { noOfSms: 20000, selected: false },
        { noOfSms: 30000, selected: false }
    ];
    return SMS_PLAN;
}