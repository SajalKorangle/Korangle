export class Fee {

    dbId: number;
    receiptNumber: number;
    amount: number;
    studentDbId: number;
    remark: string;
    generationDateTime: any;
    studentName: string;
    fatherName: string;
    className: string;

    /*Fee particulars*/
    tuitionFeeAmount = 0;
    lateFeeAmount = 0;
    cautionMoneyAmount = 0;

    copy(fees: Fee) {
        this.dbId = fees.dbId;
        this.receiptNumber = fees.receiptNumber;
        this.amount = fees.amount;
        this.studentDbId = fees.studentDbId;
        this.remark = fees.remark;
        this.generationDateTime = fees.generationDateTime;
        this.studentName = fees.studentName;
        this.fatherName = fees.fatherName;
        this.className = fees.className;

        if (fees.tuitionFeeAmount !== undefined) {
            this.tuitionFeeAmount = fees.tuitionFeeAmount;
        }
        if (fees.lateFeeAmount !== undefined) {
            this.lateFeeAmount = fees.lateFeeAmount;
        }
        if (fees.cautionMoneyAmount !== undefined) {
            this.cautionMoneyAmount = fees.cautionMoneyAmount;
        }
    }

}
