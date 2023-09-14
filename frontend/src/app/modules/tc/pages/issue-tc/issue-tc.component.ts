import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { IssueTCServiceAdapter } from './issue-tc.service.adapter';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { Student } from './../../../../services/modules/student/models/student';
import { StudentSection } from './../../../../services/modules/student/models/student-section';
import { StudentFee } from './../../../../services/modules/fees/models/student-fee';
import { SubDiscount } from './../../../../services/modules/fees/models/sub-discount';
import { SubFeeReceipt } from './../../../../services/modules/fees/models/sub-fee-receipt';

import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { FeeService } from './../../../../services/modules/fees/fee.service';
import { GenericService } from '@services/generic/generic-service';

import { INSTALLMENT_LIST } from './../../../fees/classes/constants';

interface CustomSSInterface extends StudentSection {
    parentStudentInstance: Student;
    tc: TransferCertificateNew;
    dueAmount: number;
    booksIssued: number;
}

@Component({
    selector: 'app-issue-tc',
    templateUrl: './issue-tc.component.html',
    styleUrls: ['./issue-tc.component.css'],
    providers: [TCService, StudentService, ClassService, FeeService, GenericService],
})
export class IssueTCComponent implements OnInit {
    user: any;

    certificateNumberSearchInput: string = '';
    studentNameSearchInput: string = '';

    tcIssuedOnThisPageSession: { [key: number]: boolean } = {}; // tcId->boolean

    tcList: Array<TransferCertificateNew>;

    studentSectionList: Array<StudentSection>;
    studentList: Array<Student>;
    classList: Array<any>;
    divisionList: Array<any>;

    classSectionList: Array<any>;
    studentSestionWithTC: Array<CustomSSInterface>;

    studentFeeList: Array<StudentFee>;
    subFeeReciptList: Array<SubFeeReceipt>;
    subDiscountList: Array<SubDiscount>;

    libraryStudentsWithBookIssuedList: Array<number> = [];

    userHasFeePermission: boolean = false;
    feeModule: any;
    collectFeeTask: any;

    userHasLibraryPermission: boolean = false;
    libraryModule: any;
    issueDepositBook: any;

    serviceAdapter: IssueTCServiceAdapter;
    isLoading = false;

    constructor(
        public tcService: TCService,
        public studentService: StudentService,
        public classService: ClassService,
        public feeService: FeeService,
        public genericService: GenericService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new IssueTCServiceAdapter(this);
        this.serviceAdapter.initializeData();

        this.feeModule = this.user.activeSchool.moduleList.find((m) => m.path == 'fees');
        if (this.feeModule) {
            this.collectFeeTask = this.feeModule.taskList.find((t) => t.path == 'collect_fee');
        }
        this.userHasFeePermission = this.feeModule && this.collectFeeTask;

        this.libraryModule = this.user.activeSchool.moduleList.find((m) => m.path == 'library');
        if (this.libraryModule) {
            this.issueDepositBook = this.libraryModule.taskList.find((t) => t.path == 'issue_deposit_book');
            if (this.issueDepositBook) {
                this.userHasLibraryPermission = true;
            }
        }
    }

    navigateToCollectFee(): void {
        if (this.userHasFeePermission) {
            this.user.populateSectionAndRoute(this.collectFeeTask, this.feeModule);
        }
    }

    navigateToIssueDepositBook(): void {
        if (this.userHasLibraryPermission) {
            this.user.populateSectionAndRoute(this.issueDepositBook, this.libraryModule);
        }
    }

    populateClassSectionList(classList, divisionList): void {
        this.classSectionList = [];
        classList.forEach((classs) => {
            divisionList.forEach((division) => {
                if (
                    this.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == division.id;
                    }) != undefined
                ) {
                    this.classSectionList.push({
                        class: classs,
                        section: division,
                        selected: false,
                    });
                }
            });
        });

        const divisionPerClassCount = {}; // count of divisions in each class
        this.classSectionList.forEach((cs) => {
            if (divisionPerClassCount[cs.class.id]) divisionPerClassCount[cs.class.id] += 1;
            else divisionPerClassCount[cs.class.id] = 1;
        });

        this.classSectionList = this.classSectionList.map((cs) => {
            // showDivision based of division count per class
            if (divisionPerClassCount[cs.class.id] == 1) {
                return { ...cs, showDivision: false };
            } else {
                return { ...cs, showDivision: true };
            }
        });
    }

    calculateTotalStudentFee(studentFeeList: Array<StudentFee>): number {
        let allMonthFee = 0;
        let totalLateFee = 0;
        studentFeeList.forEach((studentFee) => {
            INSTALLMENT_LIST.forEach((installmentMonth) => {
                allMonthFee += studentFee[installmentMonth + 'Amount'];

                const lateFeePerDay = studentFee[installmentMonth + 'LateFee'];
                if (lateFeePerDay && studentFee[installmentMonth + 'LastDate']) {
                    const maximumLateFee = studentFee[installmentMonth + 'MaximumLateFee'];
                    const lastDate = new Date(studentFee[installmentMonth + 'LastDate']);

                    let clearanceDate = new Date();
                    if (studentFee[installmentMonth + 'ClearanceDate']) {
                        clearanceDate = new Date(studentFee[installmentMonth + 'ClearanceDate']);
                    }

                    let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (numberOfLateDays > 0) {
                        if (maximumLateFee) {
                            totalLateFee += Math.min(lateFeePerDay * numberOfLateDays, maximumLateFee);
                        } else {
                            totalLateFee += lateFeePerDay * numberOfLateDays;
                        }
                    }
                }
            });
        });
        return allMonthFee + totalLateFee;
    }

    calculateTotalFeePaid(subFeeReceiptList: Array<SubFeeReceipt>): number {
        let totalFeePaid = 0;
        subFeeReceiptList.forEach((subFeeReceipt) => {
            INSTALLMENT_LIST.forEach((installmentMonth) => {
                totalFeePaid += subFeeReceipt[installmentMonth + 'Amount'] + subFeeReceipt[installmentMonth + 'LateFee'];
            });
        });
        return totalFeePaid;
    }

    calculateTotalDiscount(subDiscountList: Array<SubDiscount>): number {
        let totalDiscount = 0;
        subDiscountList.forEach((subDiscount) => {
            INSTALLMENT_LIST.forEach((installmentMonth) => {
                totalDiscount += subDiscount[installmentMonth + 'Amount'] + subDiscount[installmentMonth + 'LateFee'];
            });
        });
        return totalDiscount;
    }

    getStudentFeeDue(studentId: number): number {
        const filteredStudentFeeList = this.studentFeeList.filter((studentFee) => studentFee.parentStudent == studentId);
        const filteredSubFeeReceiptList = this.subFeeReciptList.filter((subFeeReceipt) =>
            filteredStudentFeeList.find((studentFee) => studentFee.id == subFeeReceipt.parentStudentFee)
        );
        const filteredDiscountList = this.subDiscountList.filter((subDiscount) =>
            filteredStudentFeeList.find((studentFee) => studentFee.id == subDiscount.parentStudentFee)
        );
        const totalFee = this.calculateTotalStudentFee(filteredStudentFeeList);
        const totalFeePaid = this.calculateTotalFeePaid(filteredSubFeeReceiptList);
        const totalDiscount = this.calculateTotalDiscount(filteredDiscountList);
        return totalFee - totalFeePaid - totalDiscount;
    }

    populateStudentSectionWithTC(): void {
        this.studentSestionWithTC = this.tcList.map((tc) => {
            const studentId = tc.parentStudent;
            const ss = this.studentSectionList.find((ss) => ss.id == tc.parentStudentSection);
            return {
                ...ss,
                tc: tc,
                parentStudentInstance: this.studentList.find((s) => s.id == ss.parentStudent),
                dueAmount: this.getStudentFeeDue(studentId),
                booksIssued: this.libraryStudentsWithBookIssuedList.reduce((acc, cur) => acc += cur == studentId ? 1 : 0, 0),
            };
        });
    }

    getClassSectionName = (classId, divisionId) => {
        const classSection = this.classSectionList.find((cs) => cs.class.id == classId && cs.section.id == divisionId);
        if (classSection.showDivision) {
            return classSection.class.name + ', ' + classSection.section.name;
        } else {
            return classSection.class.name;
        }
    }

    getFilteredStudentSectionList() {
        return this.studentSestionWithTC.filter(
            (ss) =>
                ss.tc.certificateNumber.toString().startsWith(this.certificateNumberSearchInput) &&
                ss.parentStudentInstance.name.toLowerCase().startsWith(this.studentNameSearchInput.toLowerCase())
        );
    }

    isIssueBlocked(ss: CustomSSInterface): boolean {
        return this.tcIssuedOnThisPageSession[ss.tc.id] || ss.dueAmount > 0 || ss.booksIssued > 0;
    }

    issueTC(tc: TransferCertificateNew): void {
        this.isLoading = true;
        this.serviceAdapter.issueTC(tc).then((res) => {
            this.tcIssuedOnThisPageSession[res.id] = true;
            this.isLoading = false;
        });
    }
}
