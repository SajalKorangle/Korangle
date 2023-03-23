// prettier-ignore
export interface LeaveTypeMonth {
    id: number;
    parentSchoolLeaveType: number;
    month: string; value: number;
    remainingLeavesAction: string;
}

export interface LeaveType {
    id: number;
    leaveTypeName: string;
    color: string;
    leaveType: string;
    parentSchool: string;
}
