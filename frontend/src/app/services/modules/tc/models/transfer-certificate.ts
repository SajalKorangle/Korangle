export class TransferCertificateNew{
    id: number;
    parentStudent: number;
    certificateNumber: number;

    certificateFile: any;

    issueDate: string;
    leavingDate: string;
    leavingReason: string;
    lastClassPassed: string;

    status: string;
    generatedBy: number;
    issuedBy: number;
    cancelledBy: number;
}