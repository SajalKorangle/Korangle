import { Fee } from './fee';
import {Concession} from "./concession";

export class Student {

    name: string;
    dbId: number;
    fathersName: string;
    mobileNumber: number;
    dateOfBirth: any;
    scholarNumber: any;
    totalFees: number;
    feesDue = 0;
    classDbId: number;
    remark: string;
    feesList: Fee[] = [];
    concessionList: Concession[] = [];

    copyWithoutFeesAndConcession(student: Student) {
        this.name = student.name;
        this.dbId = student.dbId;
        this.fathersName = student.fathersName;
        this.mobileNumber = student.mobileNumber;
        this.dateOfBirth = student.dateOfBirth;
        this.scholarNumber = student.scholarNumber;
        this.totalFees = student.totalFees;
        this.feesDue = student.feesDue;
        this.classDbId = student.classDbId;
        this.remark = student.remark;
    }

    copy(student: Student) {
        this.copyWithoutFeesAndConcession(student);
        this.feesList = [];
        student.feesList.forEach( fees => {
            const tempFees = new Fee();
            tempFees.copy(fees);
            this.feesList.push(tempFees);
        });
        student.concessionList.forEach( concession => {
            const tempConcession = new Concession();
            tempConcession.copy(concession);
            this.concessionList.push(tempConcession);
        });
    }

}