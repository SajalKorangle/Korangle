// prettier-ignore
export interface LeaveTypeMonth {
    id: number; parentSchoolLeaveType: number;
    month: string; value: number;
    remainingLeavesAction: string;
}
// prettier-ignore
export interface LeaveType {
    leaveTypeName: string; leaveType: "Paid" | "Unpaid" | "None"; parentSchool: string;
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
    isCustomized: boolean; leavePlanName: string;
}
// prettier-ignore
export interface EmployeeLeaveType {
    id: number; parentEmployee: number; parentLeaveType: number;
    leaveTypeName: string; leaveType: "Paid" | "Unpaid" | "None"; color: string;
}
