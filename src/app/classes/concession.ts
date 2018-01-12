export class Concession {

    dbId: number;
    amount: number;
    studentDbId: number;
    remark: string;
    generationDateTime: any;
    studentName: string;
    fatherName: string;
    className: string;

    copy(concession: Concession) {
        this.dbId = concession.dbId;
        this.amount = concession.amount;
        this.studentDbId = concession.studentDbId;
        this.remark = concession.remark;
        this.generationDateTime = concession.generationDateTime;
        this.studentName = concession.studentName;
        this.fatherName = concession.fatherName;
        this.className = concession.className;
    }

}
