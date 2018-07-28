
export class TransferCertificate {

    id: number;
    certificateNumber: number;
    issueDate: any;
    admissionDate: any;
    leavingDate: any;
    leavingReason: string;
    admissionClass: string;
    lastClassPassed: string;

    leavingMidSession: boolean = false;

    lastClassAttended: string;
    lastClassAttendance: number;
    attendanceOutOf: number;

    copy(transferCertificate: any) {
        this.id = transferCertificate.id;
        this.certificateNumber = transferCertificate.certificateNumber;
        this.issueDate = transferCertificate.issueDate;
        this.admissionDate = transferCertificate.admissionDate;
        this.leavingDate = transferCertificate.leavingDate;
        this.leavingReason = transferCertificate.leavingReason;
        this.admissionClass = transferCertificate.admissionClass;
        this.lastClassPassed = transferCertificate.lastClassPassed;
        this.leavingMidSession = transferCertificate.leavingMidSession;
        this.lastClassAttended = transferCertificate.lastClassAttended;
        this.lastClassAttendance = transferCertificate.lastClassAttendance;
        this.attendanceOutOf = transferCertificate.attendanceOutOf;
    }

    clean() {
        this.id = null;
        this.certificateNumber = null;
        this.issueDate = null;
        this.admissionDate = null;
        this.leavingDate = null;
        this.leavingReason = null;
        this.admissionClass = null;
        this.lastClassPassed = null;
        this.leavingMidSession = false;
        this.lastClassAttended = null;
        this.lastClassAttendance = null;
        this.attendanceOutOf = null;
    }

}