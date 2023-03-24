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
    color: string; assignedLeavesMonthWise: string; id: number;
}
// prettier-ignore
export interface LeavePlanToLeaveType {
    parentSchoolLeavePlan: number; parentSchoolLeaveType: number; id: number;
}
// prettier-ignore
export interface LeavePlan {
    leavePlanName: string; parentSchool: string; id: number;
}
