import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GiveDiscountServiceAdapter } from "./give-discount-service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {
    DiscountColumnFilter,
    INSTALLMENT_LIST,
    MODE_OF_PAYMENT_LIST,
    ReceiptColumnFilter
} from "../../classes/constants";
import {SESSION_LIST} from "../../../../classes/constants/session";
import {FeeType} from "../../../../services/fees/fee-type";
import {SchoolFeeRule} from "../../../../services/fees/school-fee-rule";
import {StudentFee} from "../../../../services/fees/student-fee";
import {FeeReceipt} from "../../../../services/fees/fee-receipt";
import {SubFeeReceipt} from "../../../../services/fees/sub-fee-receipt";
import {Discount} from "../../../../services/fees/discount";
import {SubDiscount} from "../../../../services/fees/sub-discount";
import {StudentService} from "../../../../services/student.service";
import {VehicleService} from "../../../vehicle/vehicle.service";
import {ClassService} from "../../../../services/class.service";
import {EmployeeService} from "../../../../services/employee.service";
import {CommonFunctions} from "../../../../classes/common-functions";
import {EmitterService} from "../../../../services/emitter.service";

declare const $: any;

@Component({
    selector: 'give-discount',
    templateUrl: './give-discount.component.html',
    styleUrls: ['./give-discount.component.css'],
    providers: [ FeeService, StudentService, VehicleService, ClassService, EmployeeService ],
})

export class GiveDiscountComponent implements OnInit {

    @Input() user;

    // Constant Lists
    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;
    receiptColumnFilter = new ReceiptColumnFilter();
    discountColumnFilter = new DiscountColumnFilter();

    // From Service Adapter
    feeTypeList: FeeType[];
    schoolFeeRuleList: SchoolFeeRule[];
    studentFeeList: StudentFee[];
    feeReceiptList: FeeReceipt[];
    subFeeReceiptList: SubFeeReceipt[];
    discountList: Discount[];
    subDiscountList: SubDiscount[];
    busStopList = [];
    employeeList = [];

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];
    studentSectionList = [];

    selectedStudentList = [];
    selectedStudentSectionList = [];
    showDetails = false;

    newDiscountList = [];
    newSubDiscountList = [];
    newRemark = null;

    studentFeeDetailsVisibleList = [];

    lateFeeVisible = true;

    serviceAdapter: GiveDiscountServiceAdapter;

    isLoading = false;

    isStudentListLoading = false;

    constructor(public feeService: FeeService,
                public studentService: StudentService,
                public vehicleService: VehicleService,
                public classService: ClassService,
                public employeeService: EmployeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GiveDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.receiptColumnFilter.receiptNumber = false;
        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.printButton = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.class = false;
            this.receiptColumnFilter.remark = false;
            this.receiptColumnFilter.employee = false;
        }

        this.discountColumnFilter.discountNumber = false;
        this.discountColumnFilter.scholarNumber = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.discountColumnFilter.class = false;
            this.discountColumnFilter.employee = false;
        }

    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
        this.studentSectionList = details.studentSectionList;
    }

    handleStudentListSelection(studentList: any): void {
        this.selectedStudentList = studentList;
        this.serviceAdapter.getStudentFeeProfile();
        this.showDetails = true;
    }

    handleStudentFeeProfile(): void {

        this.selectedStudentList.forEach(student => {
            this.sessionList.forEach(session => {
                if(this.getSessionFeesDue(student, session, false)
                    + this.getSessionLateFeesDue(student, session, false) == 0) {
                    this.studentFeeList = this.studentFeeList.filter(studentFee => {
                        return studentFee.parentStudent != student.id || studentFee.parentSession != session.id;
                    });
                }
            });
        });

        this.lateFeeVisible = this.getStudentList().reduce((total, student) => {
            return total + this.getStudentLateFeeTotal(student);
        },0) > 0;

        // this.newSubFeeReceiptList = [];
        // this.newFeeReceiptList = [];
        this.newSubDiscountList = [];
        this.newDiscountList = [];
        this.studentFeeDetailsVisibleList = [];

    }

    getBusStopName(busStopId: any): any {
        return this.busStopList.find(item => {
            return item.id == busStopId;
        }).stopName;
    }

    getClassNameByStudentAndSessionId(student: any, sessionId: any): any {
        return this.classList.find(classs => {
            return classs.dbId == this.selectedStudentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id && studentSection.parentSession == sessionId;
            }).parentClass;
        }).name;
    }

    getSectionNameByStudentAndSessionId(student: any, sessionId: any): any {
        return this.sectionList.find(section => {
            return section.id == this.selectedStudentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id && studentSection.parentSession == sessionId;
            }).parentDivision;
        }).name;
    }

    getFeeTypeByStudentFee(studentFee: any): any {
        return this.feeTypeList.find(feeType => {
            return feeType.id == studentFee.parentFeeType;
        });
    }

    policeAmountInput(value: any): boolean {
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    formatDate(dateStr: any): any {

        let d;
        if (dateStr == null) {
            d = new Date();
        } else {
            d = new Date(dateStr);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    showOrHideStudentFeeDetails(studentFee: any): void {
        if (this.studentFeeDetailsVisibleList.find(item => {
            return item == studentFee.id;
        })) {
            this.studentFeeDetailsVisibleList = this.studentFeeDetailsVisibleList.filter(item => {
                return item != studentFee.id;
            });
        } else {
            this.studentFeeDetailsVisibleList.push(studentFee.id);
        }
    }

    studentFeeDetailsVisible(studentFee: any): boolean {
        return this.studentFeeDetailsVisibleList.find(item => {
            return item == studentFee.id;
        }) != undefined;
    }

    ////////////////////////
    /// For Fee Structre ///
    ////////////////////////

    // Overall
    getOverallFeesDueTillMonth(includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentFeesDueTillMonth(student, includeNewSubFeeReceipt);
            amount += this.getStudentLateFeesDueTillMonth(student, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getOverallFeesDue(includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentFeesDue(student, includeNewSubFeeReceipt);
            amount += this.getStudentLateFeesDue(student, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getOverallTotalFees(): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentTotalFees(student);
            amount += this.getStudentLateFeeTotal(student);
        });
        return amount;
    }

    getOverallPayment(): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentPayment(student);
            amount += this.getStudentLateFeePayment(student);
        });
        return amount;
    }

    policeOverallPaymentInput(event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getOverallFeesDue(false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleOverallPaymentChange(Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleOverallPaymentChange(payment: number): void {
        let paymentLeft = payment?payment:0;

        this.sessionList.forEach(session => {
            this.installmentList.forEach(installment => {
                this.getStudentList().forEach(student => {
                    this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
                        let installmentLateFeesDue =
                            this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, false);
                        if (installmentLateFeesDue > 0) {
                            if (paymentLeft > installmentLateFeesDue) {
                                this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, installmentLateFeesDue);
                                paymentLeft -= installmentLateFeesDue;
                            } else {
                                this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, paymentLeft);
                                paymentLeft = 0;
                            }
                        }
                        let installmentFeesDue =
                            this.getStudentFeeInstallmentFeesDue(studentFee,installment, false);
                        if (installmentFeesDue > 0) {
                            if (paymentLeft > installmentFeesDue) {
                                this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, installmentFeesDue);
                                paymentLeft -= installmentFeesDue;
                            } else {
                                this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, paymentLeft);
                                paymentLeft = 0;
                            }
                        }
                    });
                });
            });
        });

    }

    // Student
    getStudentList(): any {
        return this.selectedStudentList.filter(student => {
            return this.getStudentFeesDue(student, false)
                + this.getStudentLateFeesDue(student, false) > 0;
        });
    }

    getNoFeesDueStudentList(): any {
        return this.selectedStudentList.filter(student => {
            return this.getStudentFeesDue(student, false)
                + this.getStudentLateFeesDue(student, false) == 0;
        });
    }

    getStudentFeesDue(student: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionFeesDue(student, session, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentTotalFees(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionTotalFees(student, session);
        });
        return amount;
    }

    getStudentLateFeesDue(student: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionLateFeesDue(student, session, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentLateFeeTotal(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionLateFeeTotal(student, session);
        });
        return amount;
    }

    getStudentClearanceDate(student: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredSessionListByStudent(student).every(session => {
            let sessionClearanceDate = this.getSessionClearanceDate(student, session);
            if (sessionClearanceDate) {
                if ((new Date(sessionClearanceDate).getTime() > clearanceDate.getTime())) {
                    clearanceDate = new Date(sessionClearanceDate);
                    result = sessionClearanceDate;
                }
            } else {
                clearanceDate = null;
                result = null;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentFeesDueTillMonth(student: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            if ((new Date(session.endDate)).getTime() < (new Date()).getTime()) {
                amount += this.getSessionFeesDue(student, session, includeNewSubFeeReceipt);
            } else {
                amount += this.getSessionFeesDueTillMonth(student, session, includeNewSubFeeReceipt);
            }
        });
        return amount;
    }

    getStudentLateFeesDueTillMonth(student: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            if ((new Date(session.endDate)).getTime() < (new Date()).getTime()) {
                amount += this.getSessionLateFeesDue(student, session, includeNewSubFeeReceipt);
            } else {
                amount += this.getSessionLateFeesDueTillMonth(student, session, includeNewSubFeeReceipt);
            }
        });
        return amount;
    }

    getStudentPayment(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionPayment(student, session);
        });
        return amount;
    }

    policeStudentPaymentInput(student: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentFeesDue(student, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentPaymentChange(student, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentPaymentChange(student: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        let filteredSessionList = this.getFilteredSessionListByStudent(student);
        filteredSessionList.forEach(session => {
            let sessionFeesDue =
                this.getSessionFeesDue(student, session, false);
            if (sessionFeesDue > 0) {
                if (paymentLeft > sessionFeesDue) {
                    this.handleSessionPaymentChange(student, session, sessionFeesDue);
                    paymentLeft -= sessionFeesDue;
                } else {
                    this.handleSessionPaymentChange(student, session, paymentLeft);
                    paymentLeft = 0;
                }
            }
        });
    }

    getStudentLateFeePayment(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionLateFeePayment(student, session);
        });
        return amount;
    }

    policeStudentLateFeePaymentInput(student: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentLateFeesDue(student, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentLateFeePaymentChange(student, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentLateFeePaymentChange(student: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        let filteredSessionList = this.getFilteredSessionListByStudent(student);
        filteredSessionList.forEach(session => {
            let sessionLateFeesDue =
                this.getSessionLateFeesDue(student, session, false);
            if (sessionLateFeesDue > 0) {
                if (paymentLeft > sessionLateFeesDue) {
                    this.handleSessionLateFeePaymentChange(student, session, sessionLateFeesDue);
                    paymentLeft -= sessionLateFeesDue;
                } else {
                    this.handleSessionLateFeePaymentChange(student, session, paymentLeft);
                    paymentLeft = 0;
                }
            }
        });
    }

    // Session
    getFilteredSessionListByStudent(student: any): any {
        return this.sessionList.filter(session => {
            return this.getSessionFeesDue(student, session, false)
                + this.getSessionLateFeesDue(student, session, false) > 0;
        }).sort((a,b) => {
            return a.id - b.id;
        });
    }

    getSessionFeesDue(student: any, session: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeFeesDue(studentFee, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getSessionTotalFees(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeTotalFees(studentFee);
        });
        return amount;
    }

    getSessionLateFeesDue(student: any, session: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeesDue(studentFee, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getSessionLateFeeTotal(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeeTotal(studentFee);
        });
        return amount;
    }

    getSessionClearanceDate(student: any, session: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredStudentFeeListBySession(student, session).every(studentFee => {
            let studentFeeClearanceDate = this.getStudentFeeClearanceDate(studentFee);
            if (studentFeeClearanceDate) {
                if ((new Date(studentFeeClearanceDate).getTime() > clearanceDate.getTime())) {
                    clearanceDate = new Date(studentFeeClearanceDate);
                    result = studentFeeClearanceDate;
                }
            } else {
                clearanceDate = null;
                result = null;
                return false;
            }
            return true;
        });
        return result;
    }

    getSessionFeesDueTillMonth(student: any, session: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeFeesDueTillMonth(studentFee, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getSessionLateFeesDueTillMonth(student: any, session: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeesDueTillMonth(studentFee, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getSessionPayment(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeePayment(studentFee);
        });
        return amount;
    }

    policeSessionPaymentInput(student: any, session: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getSessionFeesDue(student, session, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleSessionPaymentChange(student, session, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleSessionPaymentChange(student: any, session: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        let filteredStudentFeeList = this.getFilteredStudentFeeListBySession(student, session);
        this.installmentList.forEach(installment => {
            filteredStudentFeeList.forEach(studentFee => {
                let installmentFeesDue =
                    this.getStudentFeeInstallmentFeesDue(studentFee,installment, false);
                if (installmentFeesDue > 0) {
                    if (paymentLeft > installmentFeesDue) {
                        this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, installmentFeesDue);
                        paymentLeft -= installmentFeesDue;
                    } else {
                        this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, paymentLeft);
                        paymentLeft = 0;
                    }
                }
            });
        });
    }

    getSessionLateFeePayment(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeePayment(studentFee);
        });
        return amount;
    }

    policeSessionLateFeePaymentInput(student: any, session: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getSessionLateFeesDue(student, session, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleSessionLateFeePaymentChange(student, session, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleSessionLateFeePaymentChange(student: any, session: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        let filteredStudentFeeList = this.getFilteredStudentFeeListBySession(student, session);
        this.installmentList.forEach(installment => {
            filteredStudentFeeList.forEach(studentFee => {
                let installmentLateFeesDue =
                    this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, false);
                if (installmentLateFeesDue > 0) {
                    if (paymentLeft > installmentLateFeesDue) {
                        this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, installmentLateFeesDue);
                        paymentLeft -= installmentLateFeesDue;
                    } else {
                        this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, paymentLeft);
                        paymentLeft = 0;
                    }
                }
            });
        });
    }

    // Student Fees
    getFilteredStudentFeeListBySession(student: any, session: any): any {
        return this.studentFeeList.filter(studentFee => {
            return studentFee.parentSession == session.id
                && studentFee.parentStudent == student.id
                && this.getStudentFeeTotalFees(studentFee) > 0;
        });
    }

    getStudentFeeFeesDue(studentFee: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentFeeTotalFees(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentTotalFees(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeLateFeesDue(studentFee: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentFeeLateFeeTotal(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeClearanceDate(studentFee: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredInstallmentListByStudentFee(studentFee).every(installment => {
            let studentFeeInstallmentClearanceDate = this.getStudentFeeInstallmentClearanceDate(studentFee, installment);
            if (studentFeeInstallmentClearanceDate) {
                if ((new Date(studentFeeInstallmentClearanceDate).getTime() > clearanceDate.getTime())) {
                    clearanceDate = new Date(studentFeeInstallmentClearanceDate);
                    result = studentFeeInstallmentClearanceDate;
                }
            } else {
                clearanceDate = null;
                result = null;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentFeeFeesDueTillMonth(studentFee: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentFeeLateFeesDueTillMonth(studentFee: any, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, includeNewSubFeeReceipt);
        });
        return amount;
    }

    getStudentFeePayment(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentPayment(studentFee, installment);
        });
        return amount;
    }

    policeStudentFeePaymentInput(studentFee: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentFeeFeesDue(studentFee, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentFeePaymentChange(studentFee, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentFeePaymentChange(studentFee: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            let installmentFeesDue =
                this.getStudentFeeInstallmentFeesDue(studentFee,installment, false);
            if (installmentFeesDue > 0) {
                if (paymentLeft > installmentFeesDue) {
                    this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, installmentFeesDue);
                    paymentLeft -= installmentFeesDue;
                } else {
                    this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, paymentLeft);
                    paymentLeft = 0;
                }
            }
        });
    }

    getStudentFeeLateFeePayment(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeePayment(studentFee, installment);
        });
        return amount;
    }

    policeStudentFeeLateFeePaymentInput(studentFee: any, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentFeeLateFeesDue(studentFee, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentFeeLateFeePaymentChange(studentFee, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentFeeLateFeePaymentChange(studentFee: any, payment: number): void {
        let paymentLeft = payment?payment:0;
        this.installmentList.forEach(installment => {
            let installmentLateFeesDue =
                this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, false);
            if (installmentLateFeesDue > 0) {
                if (paymentLeft > installmentLateFeesDue) {
                    this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, installmentLateFeesDue);
                    paymentLeft -= installmentLateFeesDue;
                } else {
                    this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, paymentLeft);
                    paymentLeft = 0;
                }
            }
        });
    }

    // Installment
    getFilteredInstallmentListByStudentFee(studentFee: any): any {
        return this.installmentList.filter(installment => {
            return (studentFee[installment+'Amount'])?studentFee[installment+'Amount'] > 0:false;
        });
    }

    getFilteredInstallmentListByStudentFeeTillMonth(studentFee: any): any {
        let monthNumber = (new Date()).getMonth();
        let installmentNumber = 0;
        if (monthNumber > 2) {
            installmentNumber = monthNumber-3;
        } else {
            installmentNumber = monthNumber+9;
        }
        return this.installmentList.slice(0,installmentNumber+1).filter(installment => {
            return (studentFee[installment+'Amount'])?studentFee[installment+'Amount'] > 0:false;
        });
    }

    getStudentFeeInstallmentFeesDue(studentFee: any, installment: string, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee, includeNewSubFeeReceipt);
        amount += studentFee[installment+'Amount']?studentFee[installment+'Amount']:0;
        filteredSubReceiptList.forEach(subFeeReceipt => {
            if (subFeeReceipt[installment+'Amount']) {
                amount -= subFeeReceipt[installment+'Amount'];
            }
        });
        filteredSubDiscountList.forEach(subDiscount => {
            if (subDiscount[installment+'Amount']) {
                amount -= subDiscount[installment+'Amount'];
            }
        });
        return amount;
    }

    getStudentFeeInstallmentTotalFees(studentFee: any, installment: string): number {
        let amount = 0;
        amount += studentFee[installment+'Amount'];
        return amount;
    }

    getStudentFeeInstallmentLateFeesDue(studentFee: any, installment: string, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee, includeNewSubFeeReceipt);
        amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        filteredSubReceiptList.forEach(subFeeReceipt => {
            if (subFeeReceipt[installment+'LateFee']) {
                amount -= subFeeReceipt[installment+'LateFee'];
            }
        });
        filteredSubDiscountList.forEach(subDiscount => {
            if (subDiscount[installment+'LateFee']) {
                amount -= subDiscount[installment+'LateFee'];
            }
        });
        return amount;
    }

    getStudentFeeInstallmentLateFeeTotal(studentFee: any, installment: string): number {
        let amount = 0;
        if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
            let lastDate = new Date(studentFee[installment+'LastDate']);
            let clearanceDate = new Date();
            if (studentFee[installment+'ClearanceDate']) {
                clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
            }
            let numberOfLateDays = Math.ceil((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
            if (numberOfLateDays > 0) {
                amount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                if (studentFee[installment+'MaximumLateFee'] && studentFee[installment+'MaximumLateFee'] < amount) {
                    amount = studentFee[installment+'MaximumLateFee'];
                }
            }
        }
        return amount;
    }

    getStudentFeeInstallmentClearanceDate(studentFee: any, installment: string): any {
        return studentFee[installment+'ClearanceDate'];
    }

    getStudentFeeInstallmentPayment(studentFee: any, installment: string): number {
        let subDiscount = this.newSubDiscountList.find(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id;
        });
        return subDiscount?subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0:0;
    }

    policeStudentFeeInstallmentPaymentInput(studentFee: any, installment: string, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentFeeInstallmentFeesDue(studentFee, installment, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentFeeInstallmentPaymentChange(studentFee: any, installment: string, payment: number): void {
        let subDiscount = this.newSubDiscountList.find(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id;
        });
        let studentFeeInstallmentFeesDue =
            this.getStudentFeeInstallmentFeesDue(studentFee, installment, false);

        if (studentFeeInstallmentFeesDue == 0) {
            alert('Error in fee calculation, Contact admin');
            return;
        }

        if (subDiscount) {

            subDiscount[installment+'Amount'] = payment;
            if (payment == studentFeeInstallmentFeesDue) {
                studentFee[installment+'ClearanceDate'] = this.formatDate(null);
            } else {
                studentFee[installment+'ClearanceDate'] = null;
            }

            if (payment == 0) {
                this.checkAndDeleteNewSubDiscount(subDiscount, studentFee);
            }

        } else if (payment > 0) {

            this.createNewSubDiscount(studentFee, installment+'Amount', payment);

            if (payment == studentFeeInstallmentFeesDue) {
                studentFee[installment+'ClearanceDate'] = this.formatDate(null);
            } else {
                studentFee[installment+'ClearanceDate'] = null;
            }
        }
    }

    getStudentFeeInstallmentLateFeePayment(studentFee: any, installment: string): number {
        let subDiscount = this.newSubDiscountList.find(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id;
        });
        return subDiscount?(subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0):0;
    }

    policeStudentFeeInstallmentLateFeePaymentInput(studentFee: any, installment: string, event: any): boolean {
        if (!this.policeAmountInput(event.key)) {
            return false;
        }
        let feesDue = this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, false);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > feesDue) {
            event.srcElement.value = feesDue;
            this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    handleStudentFeeInstallmentLateFeePaymentChange(studentFee: any, installment: string, payment: number): void {
        let subDiscount = this.newSubDiscountList.find(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id;
        });
        let studentFeeInstallmentLateFeesDue =
            this.getStudentFeeInstallmentLateFeesDue(studentFee, installment, false);

        if (studentFeeInstallmentLateFeesDue == 0) {
            alert('Error in fee calculation, Contact admin');
            return;
        }

        if (subDiscount) {

            subDiscount[installment+'LateFee'] = payment;

            if (payment == 0) {
                this.checkAndDeleteNewSubDiscount(subDiscount, studentFee);
            }

        } else if (payment > 0) {

            this.createNewSubDiscount(studentFee, installment+'LateFee', payment);

        }
    }

    // Sub Fee Receipt
    getFilteredSubFeeReceiptListByStudentFee(studentFee: any): any {
        let filteredSubFeeReceiptList = this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentStudentFee == studentFee.id && !this.feeReceiptList.find(feeReceipt => {
                return feeReceipt.id == subFeeReceipt.parentFeeReceipt;
            }).cancelled;
        });
        return filteredSubFeeReceiptList;
    }

    /*createNewSubFeeReceipt(studentFee: any, installment: any, payment: any): void {

        let subFeeReceipt = new SubFeeReceipt();
        subFeeReceipt.parentStudentFee = studentFee.id;
        subFeeReceipt.parentFeeType = studentFee.parentFeeType;
        subFeeReceipt.parentSession = studentFee.parentSession;
        subFeeReceipt.isAnnually = studentFee.isAnnually;
        subFeeReceipt[installment] = payment;
        this.newSubFeeReceiptList.push(subFeeReceipt);

        this.checkAndCreateNewFeeReceipt(studentFee);

    }*/

    /*checkAndDeleteNewSubFeeReceipt(subFeeReceipt: any, studentFee: any): void {
        if (this.installmentList.reduce((total, installment) => {
            return total
                + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
        }, 0) == 0) {
            this.newSubFeeReceiptList = this.newSubFeeReceiptList.filter(subFeeReceipt => {
                return subFeeReceipt.parentStudentFee != studentFee.id;
            });
            this.checkAndDeleteNewFeeReceipt(studentFee);
        }
    }*/

    // Sub Discount
    getFilteredSubDiscountListByStudentFee(studentFee: any, includeNewSubDiscount = true): any {
        let filteredSubDiscountList = this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id && !this.discountList.find(discount => {
                return discount.id == subDiscount.parentDiscount;
            }).cancelled;
        });
        if (includeNewSubDiscount) {
            let newSubDiscount = this.newSubDiscountList.find(subDiscount => {
                return subDiscount.parentStudentFee == studentFee.id;
            });
            if (newSubDiscount) {
                filteredSubDiscountList.push(newSubDiscount);
            }
        }
        return filteredSubDiscountList;
    }

    createNewSubDiscount(studentFee: any, installment: any, payment: any): void {

        let subDiscount = new SubDiscount();
        subDiscount.parentStudentFee = studentFee.id;
        subDiscount.parentFeeType = studentFee.parentFeeType;
        subDiscount.parentSession = studentFee.parentSession;
        subDiscount.isAnnually = studentFee.isAnnually;
        subDiscount[installment] = payment;
        this.newSubDiscountList.push(subDiscount);

        this.checkAndCreateNewDiscount(studentFee);

    }

    checkAndDeleteNewSubDiscount(subDiscount: any, studentFee: any): void {
        if (this.installmentList.reduce((total, installment) => {
            return total
                + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
        }, 0) == 0) {
            this.newSubDiscountList = this.newSubDiscountList.filter(subDiscount => {
                return subDiscount.parentStudentFee != studentFee.id;
            });
            this.checkAndDeleteNewDiscount(studentFee);
        }
    }

    ////////////////////////////////////
    /// For Fee Receipts & Discounts ///
    ////////////////////////////////////

    // Fee Receipt
    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    getFeeReceiptListTotalAmount(): number {
        return this.subFeeReceiptList.reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    getLastDaySubmittedAmount(lastFeeReceipt: any): number {
        return this.getLastDaySubmittedReceipts(lastFeeReceipt).reduce((total, item) => {
            return total + this.getFeeReceiptTotalAmount(item);
        }, 0);
    }

    getLastDaySubmittedReceipts(lastFeeReceipt: any): any {
        return this.feeReceiptList.filter(item => {
            return this.formatDate(item.generationDateTime) == this.formatDate(lastFeeReceipt.generationDateTime);
        })
    }

    // Discount
    getDiscountTotalAmount(discount: any): number {
        return this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentDiscount == discount.id;
        }).reduce((totalSubDiscount, subDiscount) => {
            return totalSubDiscount + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                    + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    getDiscountListTotalAmount(): number {
        return this.subDiscountList.reduce((totalSubDiscount, subDiscount) => {
            return totalSubDiscount + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                    + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    checkAndCreateNewDiscount(studentFee: any): void {

        if (this.newDiscountList.filter(discount => {
            return discount.parentStudent == studentFee.parentStudent
                && discount.parentSession == studentFee.parentSession;
        }).length == 0) {

            let discount = new Discount();
            discount.remark = this.newRemark;
            discount.cancelled = false;
            discount.parentStudent = studentFee.parentStudent;
            discount.parentSession = studentFee.parentSession;
            discount.parentSchool = this.user.activeSchool.dbId;
            discount.parentEmployee = this.user.activeSchool.employeeId;

            this.newDiscountList.push(discount);

        }

    }

    checkAndDeleteNewDiscount(studentFee: any): void {

        if (this.newSubDiscountList.filter(subDiscount => {
            return subDiscount.parentSession == studentFee.parentSession
                && this.studentFeeList.find(item => {
                    return item.id == subDiscount.parentStudentFee;
                }).parentStudent == studentFee.parentStudent;
        }).length == 0) {
            this.newDiscountList = this.newDiscountList.filter(discount => {
                return discount.parentStudent != studentFee.parentStudent || discount.parentSession != studentFee.parentSession;
            });
        }

    }

    updateNewDiscountRemark(): void {
        this.newDiscountList.forEach(discount => {
            discount.remark = this.newRemark;
        });
    }

}
