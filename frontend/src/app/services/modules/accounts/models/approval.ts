export const APPROVAL_STATUS_CHOICES = {
    'APPROVED': 'APPROVED',
    'PENDING': 'PENDING',
    'DECLINED': 'DECLINED',
};

export class Approval{
    id: number;
    parentEmployeeRequestedBy: number;
    parentEmployeeApprovedBy: number = null;
    approvalId: number = null;
    parentTransaction: number = null;
    requestedGenerationDateTime: string;
    approvedGenerationDateTime: string = null;
    remark: string = null;
    autoAdd: boolean = false;
    transactionDate: string = null;

    requestStatus: 'APPROVED' | 'PENDING' | 'DECLINED';
};