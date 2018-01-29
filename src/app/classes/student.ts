import { Fee } from './fee';
import {Concession} from "./concession";

export class Student {

    name: string;
    dbId: number;
    fathersName: string;
    mobileNumber: number;
    dateOfBirth: any;
    rollNumber: any;
    scholarNumber: any;
    totalFees: number;
    feesDue = 0;
    classDbId: number;
    className: string;
    remark: string;

    /* new student profile head */

    motherName: string;
    gender: string;
    caste: string;
    category: string;
    religion: string;
    fatherOccupation: string;
    address: string;
    childSSMID: number;
    familySSMID: number;
    bankName: string;
    bankAccountNum: string;
    aadharNum: number;
    bloodGroup: string;
    fatherAnnualIncome: string;

    feesList: Fee[] = [];
    concessionList: Concession[] = [];

    copyWithoutFeesAndConcession(student: Student) {
        this.name = student.name;
        this.dbId = student.dbId;
        this.fathersName = student.fathersName;
        this.mobileNumber = student.mobileNumber;
        this.dateOfBirth = student.dateOfBirth;
        this.rollNumber = student.rollNumber;
        this.scholarNumber = student.scholarNumber;
        this.totalFees = student.totalFees;
        this.feesDue = student.feesDue;
        this.classDbId = student.classDbId;
        this.className = student.className;
        this.remark = student.remark;

        /* new student profile head */
        this.motherName = student.motherName;
        this.gender = student.gender;
        this.caste = student.caste;
        this.category = student.category;
        this.religion = student.religion;
        this.fatherOccupation = student.fatherOccupation;
        this.address = student.address;
        this.familySSMID = student.familySSMID;
        this.childSSMID = student.childSSMID;
        this.bankName = student.bankName;
        this.bankAccountNum = student.bankAccountNum;
        this.aadharNum = student.aadharNum;
        this.bloodGroup = student.bloodGroup;
        this.fatherAnnualIncome = student.fatherAnnualIncome;
    }

    copy(student: Student) {
        this.copyWithoutFeesAndConcession(student);
        this.feesList = [];
        student.feesList.forEach( fees => {
            const tempFees = new Fee();
            tempFees.copy(fees);
            tempFees.studentName = this.name;
            tempFees.fatherName = this.fathersName;
            tempFees.className = this.className;
            this.feesList.push(tempFees);
        });
        student.concessionList.forEach( concession => {
            const tempConcession = new Concession();
            tempConcession.copy(concession);
            this.concessionList.push(tempConcession);
        });
    }

}