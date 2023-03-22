// prettier-ignore
export interface MonthVsLeaves {
    jan: Array<number>; feb: Array<number>; mar: Array<number>;
    apr: Array<number>; may: Array<number>; jun: Array<number>;
    jul: Array<number>; aug: Array<number>; sep: Array<number>;
    oct: Array<number>; nov: Array<number>; dec: Array<number>;
}
// prettier-ignore
export interface LeaveType {
    leaveTypeName: string; leaveType: number; parentSchool: string;
    color: string; assignedLeavesMonthWise: string; id: string;
}
// prettier-ignore
export interface LeavePlanToLeaveType {
    parentSchoolLeavePlan: string; parentSchoolLeaveType: string; id: string;
}
// prettier-ignore
export interface LeavePlan {
    leavePlanName: string; parentSchool: string; id: string;
}
