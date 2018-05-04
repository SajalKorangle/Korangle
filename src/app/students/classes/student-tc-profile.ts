
export class StudentTcProfile {

    name: string;
    dbId: number;
    fathersName: string;
    dateOfBirth: any;
    scholarNumber: any;
    sectionDbId: number;
    remark: string;
    motherName: string;
    gender: string;
    caste: string;
    category: string;
    address: string;
    childSSMID: number;
    aadharNum: number;

    // TC Specific fields
    certificateNumber: number;
    issueDate: any;
    admissionDate: any;
    leavingDate: any;
    leavingReason: string;
    admissionClass: string;
    lastClassPassed: string;
    lastClassAttended: string;
    lastClassAttendance: number;
    attendanceOutOf: number;

    copy(student: any) {

        this.name = student.name;
        this.dbId = student.dbId;
        this.fathersName = student.fathersName;
        this.dateOfBirth = student.dateOfBirth;
        this.scholarNumber = student.scholarNumber;
        this.sectionDbId = student.sectionDbId;
        this.remark = student.remark;
        this.motherName = student.motherName;
        this.gender = student.gender;
        this.caste = student.caste;
        this.category = student.category;
        this.address = student.address;
        this.childSSMID = student.childSSMID;
        this.aadharNum = student.aadharNum;

    }

}