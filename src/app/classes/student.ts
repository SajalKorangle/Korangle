import { Fee } from './fee';
import {Concession} from "./concession";

export class Student {

    profileImage: string;

    name: string;
    dbId: number;
    fathersName: string;
    mobileNumber: number;
    secondMobileNumber: number;
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
    bankIfscCode: string;
    bankAccountNum: string;
    aadharNum: number;
    bloodGroup: string;
    fatherAnnualIncome: string;
    rte: string;

    busStopDbId: number;

    admissionSessionDbId: number;
    dateOfAdmission: any;

    schoolDbId: number;

    parentTransferCertificate: number;

    classDbId: number;
    sessionDbId: number;

    copy(student: any) {

        this.profileImage = student.profileImage;

        this.name = student.name;
        this.dbId = student.dbId;
        this.fathersName = student.fathersName;
        this.mobileNumber = student.mobileNumber;
        this.secondMobileNumber = student.secondMobileNumber;
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
        this.bankIfscCode = student.bankIfscCode;
        this.bankAccountNum = student.bankAccountNum;
        this.aadharNum = student.aadharNum;
        this.bloodGroup = student.bloodGroup;
        this.fatherAnnualIncome = student.fatherAnnualIncome;
        this.rte = student.rte;

        this.busStopDbId = student.busStopDbId;

        this.admissionSessionDbId = student.admissionSessionDbId;
        this.dateOfAdmission = student.dateOfAdmission;

        this.parentTransferCertificate = student.parentTransferCertificate;

        this.classDbId = student.classDbId;
        this.sessionDbId = student.sessionDbId;

    }

    /*public static getThumbnail(student: any): any {
        if (student.profileImage) {
            let url = student.profileImage;
            if (url.substr(url.length-4) === "main") {
                return url + "_thumb";
            }
            return url.substr(0, url.length-4) + "_thumb" + url.substr(url.length-4);
        } else {
            return '';
        }
    }*/

}