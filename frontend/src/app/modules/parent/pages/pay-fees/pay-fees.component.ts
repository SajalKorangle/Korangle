import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FeeService } from '../../../../services/modules/fees/fee.service';

import { PayFeesServiceAdapter } from './pay-fees.service.adapter';
import { PayFeesHTMLRenderer } from './pay-fees.html.renderer';

import { SubFeeReceipt } from '../../../../services/modules/fees/models/sub-fee-receipt';
import { FeeReceipt } from '../../../../services/modules/fees/models/fee-receipt';
import { DiscountColumnFilter, INSTALLMENT_LIST, MODE_OF_PAYMENT_LIST, ReceiptColumnFilter } from '../../../fees/classes/constants';
import { FeeType } from '../../../../services/modules/fees/models/fee-type';
import { SchoolFeeRule } from '../../../../services/modules/fees/models/school-fee-rule';
import { StudentFee } from '../../../../services/modules/fees/models/student-fee';
import { Discount } from '../../../../services/modules/fees/models/discount';
import { SubDiscount } from '../../../../services/modules/fees/models/sub-discount';
import { VehicleOldService } from '../../../../services/modules/vehicle/vehicle-old.service';
import { CommonFunctions } from '../../../../classes/common-functions';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';
import { VALIDATORS_REGX } from '@classes/regx-validators';
import { Student } from '@services/modules/student/models/student';
import { Session } from '@services/modules/school/models/session';
import { PaymentService } from '@services/modules/payment/payment.service';

import { Order } from '@services/modules/payment/models/order';
import { OnlineFeePaymentTransaction } from '@services/modules/fees/models/online-fee-payment-transaction';

declare const $: any;

@Component({
    selector: 'view-fee',
    templateUrl: './pay-fees.component.html',
    styleUrls: ['./pay-fees.component.css'],
    providers: [
        FeeService,
        VehicleOldService,
        SchoolService,
        GenericService,
        PaymentService
    ],
})

export class PayFeesComponent implements OnInit {
    user;

    // Constant Lists
    installmentList = INSTALLMENT_LIST;
    sessionList = [];
    boardList = [];
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
    feeReceiptBookList = [];

    selectedFeeReceiptBook: any;

    // Fee Payment
    email: string = '';
    amountMappedByStudentId: { [key: number]: number; } = {};
    newSubFeeReceiptListMappedByStudentId: { [key: number]: Array<Partial<SubFeeReceipt>>; } = {};

    // Validator
    validatorRegex = VALIDATORS_REGX;

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    selectedStudentList = [];
    selectedStudentSectionList = [];

    studentFeeDetailsVisibleList = [];

    lateFeeVisible = true;

    paymentTransactionList: Array<OnlineFeePaymentTransaction>;
    orderList: Array<Order>;
    parsedOrder: Array<ParsedOrder>;

    schoolMerchantAccount;

    isMobile = CommonFunctions.getInstance().isMobileMenu;

    htmlRenderer: PayFeesHTMLRenderer;
    serviceAdapter: PayFeesServiceAdapter;

    isLoading = true;

    constructor(
        public schoolService: SchoolService,
        public genericService: GenericService,
        public feeService: FeeService,
        public vehicleService: VehicleOldService,
        public paymentService: PaymentService,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.selectedStudentList = this.user.section.student.studentList;

        this.htmlRenderer = new PayFeesHTMLRenderer(this);

        this.serviceAdapter = new PayFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.receiptColumnFilter.receiptNumber = false;
        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.printButton = true;
        this.receiptColumnFilter.status = false;
        this.receiptColumnFilter.mobileNumber = false;

        if (CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.employee = false;
        }

        this.discountColumnFilter.discountNumber = false;
        this.discountColumnFilter.scholarNumber = false;

        if (CommonFunctions.getInstance().isMobileMenu()) {
            this.discountColumnFilter.class = false;
            this.discountColumnFilter.employee = false;
        }

        // fee payment initializing
        if (this.user.email) {
            this.email = this.user.email;
        }

        this.selectedStudentList.forEach(student => {
            this.newSubFeeReceiptListMappedByStudentId[student.id] = [];
        });
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    parseOrder() {
        this.parsedOrder = this.orderList.map(order => {
            return {
                ...order,
                feeTranactionList: this.paymentTransactionList.filter(transaction => transaction.parentOrder == order.orderId),
            };
        });
    }

    amountError(student: Student) {
        const amountErrorHandler = () => {  // callback error checking function, checkf if fee payment amount exceeds the maximum amount
            if (this.amountMappedByStudentId[student.id] < 0)
                return true;
            if (this.amountMappedByStudentId[student.id] > (this.getStudentFeesDue(student) + this.getStudentLateFeesDue(student)))
                return true;
            return false;
        };
        return amountErrorHandler;
    }

    handleOverallPaymentChange(student: Student): void {
        if (this.amountError(student)())
            return;
        let paymentLeft = this.amountMappedByStudentId[student.id];
        this.newSubFeeReceiptListMappedByStudentId[student.id] = []; // start with empty

        if (paymentLeft == 0)
            return;

        this.sessionList.forEach((session: Session) => {
            this.installmentList.forEach((installment) => {
                this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee: StudentFee) => {
                    let installmentLateFeesDue = this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
                    if (installmentLateFeesDue > 0) {
                        if (paymentLeft > installmentLateFeesDue) {
                            this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, installmentLateFeesDue);
                            paymentLeft -= installmentLateFeesDue;
                        } else {
                            this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, paymentLeft);
                            paymentLeft = 0;
                        }
                    }
                    let installmentFeesDue = this.getStudentFeeInstallmentFeesDue(studentFee, installment);
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
    }

    handleStudentFeeInstallmentLateFeePaymentChange(studentFee: StudentFee, installment: string, payment: number): void {
        if (payment == 0)
            return;
        let subFeeReceipt = this.newSubFeeReceiptListMappedByStudentId[studentFee.parentStudent].find((subFeeReceipt) => {
            return subFeeReceipt.parentStudentFee == studentFee.id;
        });

        if (subFeeReceipt) {
            subFeeReceipt[installment + 'LateFee'] = payment;

        } else {
            this.createNewSubFeeReceipt(studentFee, installment + 'LateFee', payment);
        }
    }

    createNewSubFeeReceipt(studentFee: StudentFee, installment: any, payment: any): void {
        let subFeeReceipt = new SubFeeReceipt();
        subFeeReceipt.parentStudentFee = studentFee.id;
        subFeeReceipt.parentFeeType = studentFee.parentFeeType;
        subFeeReceipt.parentSession = studentFee.parentSession;
        subFeeReceipt.isAnnually = studentFee.isAnnually;
        subFeeReceipt[installment] = payment;
        this.newSubFeeReceiptListMappedByStudentId[studentFee.parentStudent].push(subFeeReceipt);
    }

    handleStudentFeeInstallmentPaymentChange(studentFee: StudentFee, installment: string, payment: number): void {
        if (payment == 0)
            return;
        let subFeeReceipt = this.newSubFeeReceiptListMappedByStudentId[studentFee.parentStudent].find((subFeeReceipt) => {
            return subFeeReceipt.parentStudentFee == studentFee.id;
        });

        if (subFeeReceipt) {
            subFeeReceipt[installment + 'Amount'] = payment;
        } else if (payment > 0) {
            this.createNewSubFeeReceipt(studentFee, installment + 'Amount', payment);
        }
    }

    handleStudentFeeProfile(): void {
        this.selectedStudentList.forEach((student) => {
            this.sessionList.forEach((session) => {
                if (this.getSessionFeesDue(student, session) + this.getSessionLateFeesDue(student, session) == 0) {
                    this.studentFeeList = this.studentFeeList.filter((studentFee) => {
                        return studentFee.parentStudent != student.id || studentFee.parentSession != session.id;
                    });
                }
            });
        });

        this.lateFeeVisible =
            this.getStudentList().reduce((total, student) => {
                return total + this.getStudentLateFeeTotal(student);
            }, 0) > 0;

        this.studentFeeDetailsVisibleList = [];
    }

    getSessionFilteredNewSubFeeReceiptList(student, session: Session): Array<Partial<SubFeeReceipt>> {
        return this.newSubFeeReceiptListMappedByStudentId[student.id].filter(subFeeReceipt => subFeeReceipt.parentSession == session.id);
    }

    getStudentFeeFilteredNewSubFeeReceiptList(student: Student, studentFee: StudentFee): Array<Partial<SubFeeReceipt>> {
        return this.newSubFeeReceiptListMappedByStudentId[student.id].filter(subFeeReceipt => subFeeReceipt.parentStudentFee == studentFee.id);
    }

    getSubFeeReceiptTotalFee(subFeeReceiptList: Array<Partial<SubFeeReceipt>>, installmentList: string[] = this.installmentList) {
        let amount = 0;
        subFeeReceiptList.forEach(subFeeReceipt => {
            installmentList.forEach(installment => {
                if (subFeeReceipt[installment + 'Amount'])
                    amount += subFeeReceipt[installment + 'Amount'];
            });
        });
        return amount;
    }

    getSubFeeReceiptTotalLateFee(subFeeReceiptList: Array<Partial<SubFeeReceipt>>, installmentList: string[] = this.installmentList) {
        let amount = 0;
        subFeeReceiptList.forEach(subFeeReceipt => {
            installmentList.forEach(installment => {
                if (subFeeReceipt[installment + 'LateFee'])
                    amount += subFeeReceipt[installment + 'LateFee'];
            });
        });
        return amount;
    }

    getNewSubFeeReceiptTotalFee(student): number {
        const subFeeReceiptList = this.newSubFeeReceiptListMappedByStudentId[student.id];
        return this.getSubFeeReceiptTotalFee(subFeeReceiptList);
    }

    getNewSubFeeReceiptTotalLateFee(student): number {
        const subFeeReceiptList = this.newSubFeeReceiptListMappedByStudentId[student.id];
        return this.getSubFeeReceiptTotalLateFee(subFeeReceiptList);
    }

    getSessionFilteredNewTotalFee(student: Student, session: Session): number {
        const filteredSubFeeReceiptList = this.getSessionFilteredNewSubFeeReceiptList(student, session);
        return this.getSubFeeReceiptTotalFee(filteredSubFeeReceiptList);
    }

    getSessionFilteredNewLateFee(student: Student, session: Session): number {
        const filteredSubFeeReceiptList = this.getSessionFilteredNewSubFeeReceiptList(student, session);
        return this.getSubFeeReceiptTotalLateFee(filteredSubFeeReceiptList);
    }

    getStudentFeeFilteredNewLateFee(student: Student, studentFee: StudentFee, installmentList: string[] = this.installmentList): number {
        const filteresSubFeeReceiptList = this.getStudentFeeFilteredNewSubFeeReceiptList(student, studentFee);
        return this.getSubFeeReceiptTotalLateFee(filteresSubFeeReceiptList, installmentList);
    }

    getStudentFeeFilteredNewTotalFee(student: Student, studentFee: StudentFee, installmentList: string[] = this.installmentList): number {
        const filteresSubFeeReceiptList = this.getStudentFeeFilteredNewSubFeeReceiptList(student, studentFee);
        return this.getSubFeeReceiptTotalFee(filteresSubFeeReceiptList, installmentList);
    }

    getFeeTypeByStudentFee(studentFee: any): any {
        return this.feeTypeList.find((feeType) => {
            return feeType.id == studentFee.parentFeeType;
        });
    }

    getTotalPaymentAmount(): number {
        return Object.values(this.amountMappedByStudentId).reduce((acc: number, next: number) => acc + next, 0);
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
        if (
            this.studentFeeDetailsVisibleList.find((item) => {
                return item == studentFee.id;
            })
        ) {
            this.studentFeeDetailsVisibleList = this.studentFeeDetailsVisibleList.filter((item) => {
                return item != studentFee.id;
            });
        } else {
            this.studentFeeDetailsVisibleList.push(studentFee.id);
        }
    }

    studentFeeDetailsVisible(studentFee: any): boolean {
        return (
            this.studentFeeDetailsVisibleList.find((item) => {
                return item == studentFee.id;
            }) != undefined
        );
    }

    ////////////////////////
    /// For Fee Structre ///
    ////////////////////////

    // Overall
    getOverallFeesDueTillMonth(): number {
        let amount = 0;
        this.getStudentList().forEach((student) => {
            amount += this.getStudentFeesDueTillMonth(student);
            amount += this.getStudentLateFeesDueTillMonth(student);
        });
        return amount;
    }

    getOverallFeesDue(): number {
        let amount = 0;
        this.getStudentList().forEach((student) => {
            amount += this.getStudentFeesDue(student);
            amount += this.getStudentLateFeesDue(student);
        });
        return amount;
    }

    getOverallTotalFees(): number {
        let amount = 0;
        this.getStudentList().forEach((student) => {
            amount += this.getStudentTotalFees(student);
            amount += this.getStudentLateFeeTotal(student);
        });
        return amount;
    }

    // Student
    getStudentList(): any {
        return this.selectedStudentList.filter((student) => {
            return this.getStudentFeesDue(student) + this.getStudentLateFeesDue(student) > 0;
        });
    }

    getNoFeesDueStudentList(): any {
        return this.selectedStudentList.filter((student) => {
            return this.getStudentFeesDue(student) + this.getStudentLateFeesDue(student) == 0;
        });
    }

    getStudentFeesDue(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            amount += this.getSessionFeesDue(student, session);
        });
        return amount;
    }

    getStudentTotalFees(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            amount += this.getSessionTotalFees(student, session);
        });
        return amount;
    }

    getStudentLateFeesDue(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            amount += this.getSessionLateFeesDue(student, session);
        });
        return amount;
    }

    getStudentLateFeeTotal(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            amount += this.getSessionLateFeeTotal(student, session);
        });
        return amount;
    }

    minZeroCorrection(amount: number): number {
        if (amount < 0)
            return 0;
        return amount;
    }

    getStudentClearanceDate(student: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredSessionListByStudent(student).every((session) => {
            let sessionClearanceDate = this.getSessionClearanceDate(student, session);
            if (sessionClearanceDate) {
                if (new Date(sessionClearanceDate).getTime() > clearanceDate.getTime()) {
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

    getStudentFeesDueTillMonth(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            if (new Date(session.endDate).getTime() < new Date().getTime()) {
                amount += this.getSessionFeesDue(student, session);
            } else {
                amount += this.getSessionFeesDueTillMonth(student, session);
            }
        });
        return amount;
    }

    getStudentLateFeesDueTillMonth(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach((session) => {
            if (new Date(session.endDate).getTime() < new Date().getTime()) {
                amount += this.getSessionLateFeesDue(student, session);
            } else {
                amount += this.getSessionLateFeesDueTillMonth(student, session);
            }
        });
        return amount;
    }

    // Session
    getFilteredSessionListByStudent(student: any): any {
        return this.sessionList
            .filter((session) => {
                return this.getSessionFeesDue(student, session) + this.getSessionLateFeesDue(student, session) > 0;
            })
            .sort((a, b) => {
                return a.orderNumber - b.orderNumber;
            });
    }

    getSessionFeesDue(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeFeesDue(studentFee);
        });
        return amount;
    }

    getSessionTotalFees(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeTotalFees(studentFee);
        });
        return amount;
    }

    getSessionLateFeesDue(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeLateFeesDue(studentFee);
        });
        return amount;
    }

    getSessionLateFeeTotal(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeLateFeeTotal(studentFee);
        });
        return amount;
    }

    getSessionClearanceDate(student: any, session: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredStudentFeeListBySession(student, session).every((studentFee) => {
            let studentFeeClearanceDate = this.getStudentFeeClearanceDate(studentFee);
            if (studentFeeClearanceDate) {
                if (new Date(studentFeeClearanceDate).getTime() > clearanceDate.getTime()) {
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

    getSessionFeesDueTillMonth(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeFeesDueTillMonth(studentFee);
        });
        return amount;
    }

    getSessionLateFeesDueTillMonth(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach((studentFee) => {
            amount += this.getStudentFeeLateFeesDueTillMonth(studentFee);
        });
        return amount;
    }

    // Student Fees
    getFilteredStudentFeeListBySession(student: any, session: any): any {
        return this.studentFeeList.filter((studentFee) => {
            return (
                studentFee.parentSession == session.id &&
                studentFee.parentStudent == student.id &&
                this.getStudentFeeTotalFees(studentFee) > 0
            );
        });
    }

    getStudentFeeFeesDue(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeTotalFees(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentTotalFees(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeLateFeesDue(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeLateFeeTotal(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeClearanceDate(studentFee: any): any {
        let clearanceDate = new Date('1000-01-01');
        let result = null;
        this.getFilteredInstallmentListByStudentFee(studentFee).every((installment) => {
            let studentFeeInstallmentClearanceDate = this.getStudentFeeInstallmentClearanceDate(studentFee, installment);
            if (studentFeeInstallmentClearanceDate) {
                if (new Date(studentFeeInstallmentClearanceDate).getTime() > clearanceDate.getTime()) {
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

    getStudentFeeFeesDueTillMonth(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeLateFeesDueTillMonth(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
        });
        return amount;
    }

    // Installment
    getFilteredInstallmentListByStudentFee(studentFee: any): any {
        return this.installmentList.filter((installment) => {
            return studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] > 0 : false;
        });
    }

    getFilteredInstallmentListByStudentFeeTillMonth(studentFee: any): any {
        let monthNumber = new Date().getMonth();
        let installmentNumber = 0;
        if (monthNumber > 2) {
            installmentNumber = monthNumber - 3;
        } else {
            installmentNumber = monthNumber + 9;
        }
        return this.installmentList.slice(0, installmentNumber + 1).filter((installment) => {
            return studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] > 0 : false;
        });
    }

    getStudentFeeInstallmentFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
        amount += studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0;
        filteredSubReceiptList.forEach((subFeeReceipt) => {
            if (subFeeReceipt[installment + 'Amount']) {
                amount -= subFeeReceipt[installment + 'Amount'];
            }
        });
        filteredSubDiscountList.forEach((subDiscount) => {
            if (subDiscount[installment + 'Amount']) {
                amount -= subDiscount[installment + 'Amount'];
            }
        });
        return amount;
    }

    getStudentFeeInstallmentTotalFees(studentFee: any, installment: string): number {
        let amount = 0;
        amount += studentFee[installment + 'Amount'];
        return amount;
    }

    getStudentFeeInstallmentLateFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
        amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        filteredSubReceiptList.forEach((subFeeReceipt) => {
            if (subFeeReceipt[installment + 'LateFee']) {
                amount -= subFeeReceipt[installment + 'LateFee'];
            }
        });
        filteredSubDiscountList.forEach((subDiscount) => {
            if (subDiscount[installment + 'LateFee']) {
                amount -= subDiscount[installment + 'LateFee'];
            }
        });
        return amount;
    }

    getStudentFeeInstallmentLateFeeTotal(studentFee: any, installment: string): number {
        let amount = 0;
        if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
            let lastDate = new Date(studentFee[installment + 'LastDate']);
            let clearanceDate = new Date();
            if (studentFee[installment + 'ClearanceDate']) {
                clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
            }
            let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (numberOfLateDays > 0) {
                amount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < amount) {
                    amount = studentFee[installment + 'MaximumLateFee'];
                }
            }
        }
        return amount;
    }

    getStudentFeeInstallmentClearanceDate(studentFee: any, installment: string): any {
        return studentFee[installment + 'ClearanceDate'];
    }

    // Sub Fee Receipt
    getFilteredSubFeeReceiptListByStudentFee(studentFee: any): any {
        let filteredSubFeeReceiptList = this.subFeeReceiptList.filter((subFeeReceipt) => {
            return (
                subFeeReceipt.parentStudentFee == studentFee.id &&
                !this.feeReceiptList.find((feeReceipt) => {
                    return feeReceipt.id == subFeeReceipt.parentFeeReceipt;
                }).cancelled
            );
        });
        return filteredSubFeeReceiptList;
    }

    // Sub Discount
    getFilteredSubDiscountListByStudentFee(studentFee: any): any {
        let filteredSubDiscountList = this.subDiscountList.filter((subDiscount) => {
            return (
                subDiscount.parentStudentFee == studentFee.id &&
                !this.discountList.find((discount) => {
                    return discount.id == subDiscount.parentDiscount;
                }).cancelled
            );
        });
        return filteredSubDiscountList;
    }

    ////////////////////////////////////
    /// For Fee Receipts & Discounts ///
    ////////////////////////////////////

    // Fee Receipt
    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList
            .filter((subFeeReceipt) => {
                return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
            })
            .reduce((totalSubFeeReceipt, subFeeReceipt) => {
                return (
                    totalSubFeeReceipt +
                    this.installmentList.reduce((totalInstallment, installment) => {
                        return (
                            totalInstallment +
                            (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                            (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                        );
                    }, 0)
                );
            }, 0);
    }

    getFeeReceiptListTotalAmount(): number {
        return this.subFeeReceiptList.reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return (
                totalSubFeeReceipt +
                this.installmentList.reduce((totalInstallment, installment) => {
                    return (
                        totalInstallment +
                        (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                        (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                    );
                }, 0)
            );
        }, 0);
    }

    getLastDaySubmittedAmount(lastFeeReceipt: any): number {
        return this.getLastDaySubmittedReceipts(lastFeeReceipt).reduce((total, item) => {
            return total + this.getFeeReceiptTotalAmount(item);
        }, 0);
    }

    getLastDaySubmittedReceipts(lastFeeReceipt: any): any {
        return this.feeReceiptList.filter((item) => {
            return this.formatDate(item.generationDateTime) == this.formatDate(lastFeeReceipt.generationDateTime);
        });
    }

    // Discount
    getDiscountTotalAmount(discount: any): number {
        return this.subDiscountList
            .filter((subDiscount) => {
                return subDiscount.parentDiscount == discount.id;
            })
            .reduce((totalSubDiscount, subDiscount) => {
                return (
                    totalSubDiscount +
                    this.installmentList.reduce((totalInstallment, installment) => {
                        return (
                            totalInstallment +
                            (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                            (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                        );
                    }, 0)
                );
            }, 0);
    }

    getDiscountListTotalAmount(): number {
        return this.subDiscountList.reduce((totalSubDiscount, subDiscount) => {
            return (
                totalSubDiscount +
                this.installmentList.reduce((totalInstallment, installment) => {
                    return (
                        totalInstallment +
                        (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                        (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                    );
                }, 0)
            );
        }, 0);
    }
}


interface ParsedOrder extends Order {
    feeTranactionList: Array<OnlineFeePaymentTransaction>;
}
