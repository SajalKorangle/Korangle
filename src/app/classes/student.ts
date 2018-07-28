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
    // totalFees: number;
    // feesDue: number;
    sectionDbId: number;
    remark: string;
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
    rte: string;

    busStopDbId: number;

    admissionSessionDbId: number;

    schoolDbId: number;

    parentTransferCertificate: number;

    copy(student: any) {

        this.name = student.name;
        this.dbId = student.dbId;
        this.fathersName = student.fathersName;
        this.mobileNumber = student.mobileNumber;
        this.dateOfBirth = student.dateOfBirth;
        this.rollNumber = student.rollNumber;
        this.scholarNumber = student.scholarNumber;
        // this.totalFees = student.totalFees;
        // this.feesDue = student.feesDue;
        this.sectionDbId = student.sectionDbId;
        this.remark = student.remark;
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
        this.rte = student.rte;

        this.busStopDbId = student.busStopDbId;

        this.admissionSessionDbId = student.admissionSessionDbId;

        this.parentTransferCertificate = student.parentTransferCertificate;

    }

}