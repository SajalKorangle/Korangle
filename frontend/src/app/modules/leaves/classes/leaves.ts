// prettier-ignore
export interface LeaveTypeMonth {
    id: number; parentSchoolLeaveType: number;
    month: string; value: number;
    remainingLeavesAction: string;
}

export interface LeaveType {
    id: number; leaveTypeName: string;
    color: string; leaveType: string;
    parentSchool: string;
}
// prettier-ignore
export interface LeaveType {
    leaveTypeName: string; leaveType: string; parentSchool: string;
    color: string; id: number;
}
// prettier-ignore
export interface LeavePlanToLeaveType {
    parentSchoolLeavePlan: number; parentSchoolLeaveType: number; id: number;
}
// prettier-ignore
export interface LeavePlan {
    leavePlanName: string; parentSchool: string; id: number;
}
// prettier-ignore
export interface LeavePlanToEmployee {
    parentEmployee: number; parentSchoolLeavePlan: number; id: number;
}
// prettier-ignore
export interface EmployeeLeavePlan {
    id: number; parentEmployee: number; activeLeavePlan: number;
}
