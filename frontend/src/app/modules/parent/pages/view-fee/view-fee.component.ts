import {ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import {FeeService} from "../../../../services/modules/fees/fee.service";
import {StudentService} from "../../../../services/modules/student/student.service";

import {ViewFeeServiceAdapter} from "./view-fee.service.adapter";
import {EmitterService} from "../../../../services/emitter.service";
import {SubFeeReceipt} from "../../../../services/modules/fees/models/sub-fee-receipt";
import {FeeReceipt} from "../../../../services/modules/fees/models/fee-receipt";
import {
    DiscountColumnFilter,
    INSTALLMENT_LIST,
    MODE_OF_PAYMENT_LIST,
    ReceiptColumnFilter
} from "../../../fees/classes/constants";
import {FeeType} from "../../../../services/modules/fees/models/fee-type";
import {SchoolFeeRule} from "../../../../services/modules/fees/models/school-fee-rule";
import {StudentFee} from "../../../../services/modules/fees/models/student-fee";
import {Discount} from "../../../../services/modules/fees/models/discount";
import {SubDiscount} from "../../../../services/modules/fees/models/sub-discount";
import {VehicleOldService} from "../../../../services/modules/vehicle/vehicle-old.service";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {CommonFunctions} from "../../../../classes/common-functions";
import {ClassService} from "../../../../services/modules/class/class.service";
import {DataStorage} from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { values } from 'lodash';
import { time } from 'console';
declare const $: any;
declare const CashFree: any;

@Component({
    selector: 'view-fee',
    templateUrl: './view-fee.component.html',
    styleUrls: ['./view-fee.component.css'],
    providers: [ FeeService, StudentService,ClassService, VehicleOldService, EmployeeService, SchoolService ],
})

export class ViewFeeComponent implements OnInit {

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

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    selectedStudentList = [];
    selectedStudentSectionList = [];

    studentFeeDetailsVisibleList = [];

    lateFeeVisible = true;

    serviceAdapter: ViewFeeServiceAdapter;

    isLoading = false;

    constructor (public schoolService : SchoolService,
                 public feeService: FeeService,
                 public studentService: StudentService,
                 public vehicleService: VehicleOldService,
                 public employeeService: EmployeeService,
                 public classService : ClassService,
                 private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

          var config = {
            layout : {},
            checkout : "transparent",
            mode : "TEST",
          }
            var response = CashFree.init(config);

            if (response.status != "OK") {
            // Handle error in initializing
                console.log('response from cashfree init ' + '     '+response.status); 
                console.dir(response)
            }
            else {
                console.log('response from cashfree init' + response)
                console.dir(response)
            }

        this.selectedStudentList = this.user.section.student.studentList;

        this.serviceAdapter = new ViewFeeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.receiptColumnFilter.receiptNumber = false;
        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.printButton = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.employee = false;
        }

        this.discountColumnFilter.discountNumber = false;
        this.discountColumnFilter.scholarNumber = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.discountColumnFilter.class = false;
            this.discountColumnFilter.employee = false;
        }

    }
    payCard = function() {
        let data = {
            appId : "50334e5204e60357816fa8e6d43305",
            orderId : Date.now().toString(),
            orderAmount : '1',
            customerName : "Avinash",
            customerPhone : "7050701850",
            customerEmail : "avinash7may@gmail.com",
            returnUrl : "",
            orderNote : "testing",
            pc : "no",
            orderCurrency : "INR",
            paymentToken : "",
            paymentOption : "card",
            card : {
                number : (<HTMLInputElement>document.getElementById("card-num")).value,
                expiryMonth : (<HTMLInputElement>document.getElementById("card-mm")).value,
                expiryYear : (<HTMLInputElement>document.getElementById("card-yyyy")).value,
                holder : (<HTMLInputElement>document.getElementById("card-name")).value,
                cvv : (<HTMLInputElement>document.getElementById("card-cvv")).value,
            },
            vendors:[
                {
                  "vendorId":"SELF", 
                  "commission":50
                },
                {
                  "vendorId":"VEN001", 
                  "commission":50
                }
              ], 
        }
        this.feeService.createObject(this.feeService.parent_transaction,data).then(value => {
            console.log('response of payment token ');
            console.dir(value)
            data.paymentToken =  value.paymentToken;
            data['vendorSplit'] = value.vsplit;
        })
        


    CashFree.initPopup(); // This is required for the popup to work even in case of callback.
        $.ajax({
        url: "https://reqres.in/api/users?page=2", // This is an open endpoint.
        type: "GET",
        success: function(response){
            console.log('success response is ');
            console.dir(response)
            
            console.log(data)
            CashFree.paySeamless(data);
            // return false;

        }
        });
    };
    

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    handleStudentFeeProfile(): void {

        this.selectedStudentList.forEach(student => {
            this.sessionList.forEach(session => {
                if(this.getSessionFeesDue(student, session)
                    + this.getSessionLateFeesDue(student, session) == 0) {
                    this.studentFeeList = this.studentFeeList.filter(studentFee => {
                        return studentFee.parentStudent != student.id || studentFee.parentSession != session.id;
                    });
                }
            });
        });

        this.lateFeeVisible = this.getStudentList().reduce((total, student) => {
            return total + this.getStudentLateFeeTotal(student);
        },0) > 0;

        this.studentFeeDetailsVisibleList = [];

    }

    getFeeTypeByStudentFee(studentFee: any): any {
        return this.feeTypeList.find(feeType => {
            return feeType.id == studentFee.parentFeeType;
        });
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
    getOverallFeesDueTillMonth(): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentFeesDueTillMonth(student);
            amount += this.getStudentLateFeesDueTillMonth(student);
        });
        return amount;
    }

    getOverallFeesDue(): number {
        let amount = 0;
        this.getStudentList().forEach(student => {
            amount += this.getStudentFeesDue(student);
            amount += this.getStudentLateFeesDue(student);
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
    
    // Student
    getStudentList(): any {
        return this.selectedStudentList.filter(student => {
            return this.getStudentFeesDue(student)
                + this.getStudentLateFeesDue(student) > 0;
        });
    }

    getNoFeesDueStudentList(): any {
        return this.selectedStudentList.filter(student => {
            return this.getStudentFeesDue(student)
                + this.getStudentLateFeesDue(student) == 0;
        });
    }

    getStudentFeesDue(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionFeesDue(student, session);
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

    getStudentLateFeesDue(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            amount += this.getSessionLateFeesDue(student, session);
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

    getStudentFeesDueTillMonth(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            if ((new Date(session.endDate)).getTime() < (new Date()).getTime()) {
                amount += this.getSessionFeesDue(student, session);
            } else {
                amount += this.getSessionFeesDueTillMonth(student, session);
            }
        });
        return amount;
    }

    getStudentLateFeesDueTillMonth(student: any): number {
        let amount = 0;
        this.getFilteredSessionListByStudent(student).forEach(session => {
            if ((new Date(session.endDate)).getTime() < (new Date()).getTime()) {
                amount += this.getSessionLateFeesDue(student, session);
            } else {
                amount += this.getSessionLateFeesDueTillMonth(student, session);
            }
        });
        return amount;
    }

    // Session
    getFilteredSessionListByStudent(student: any): any {
        return this.sessionList.filter(session => {
            return this.getSessionFeesDue(student, session)
                + this.getSessionLateFeesDue(student, session) > 0;
        }).sort((a,b) => {
            return a.id - b.id;
        });
    }

    getSessionFeesDue(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeFeesDue(studentFee);
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

    getSessionLateFeesDue(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeesDue(studentFee);
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

    getSessionFeesDueTillMonth(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeFeesDueTillMonth(studentFee);
        });
        return amount;
    }

    getSessionLateFeesDueTillMonth(student: any, session: any): number {
        let amount = 0;
        this.getFilteredStudentFeeListBySession(student, session).forEach(studentFee => {
            amount += this.getStudentFeeLateFeesDueTillMonth(studentFee);
        });
        return amount;
    }

    // Student Fees
    getFilteredStudentFeeListBySession(student: any, session: any): any {
        return this.studentFeeList.filter(studentFee => {
            return studentFee.parentSession == session.id
                && studentFee.parentStudent == student.id
                && this.getStudentFeeTotalFees(studentFee) > 0;
        });
    }

    getStudentFeeFeesDue(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
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

    getStudentFeeLateFeesDue(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
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

    getStudentFeeFeesDueTillMonth(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
        });
        return amount;
    }

    getStudentFeeLateFeesDueTillMonth(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFeeTillMonth(studentFee).forEach(installment => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
        });
        return amount;
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

    getStudentFeeInstallmentFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
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

    getStudentFeeInstallmentLateFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
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
            let numberOfLateDays = Math.floor((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
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

    // Sub Fee Receipt
    getFilteredSubFeeReceiptListByStudentFee(studentFee: any): any {
        let filteredSubFeeReceiptList = this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentStudentFee == studentFee.id && !this.feeReceiptList.find(feeReceipt => {
                return feeReceipt.id == subFeeReceipt.parentFeeReceipt;
            }).cancelled;
        });
        return filteredSubFeeReceiptList;
    }

    // Sub Discount
    getFilteredSubDiscountListByStudentFee(studentFee: any): any {
        let filteredSubDiscountList = this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentStudentFee == studentFee.id && !this.discountList.find(discount => {
                return discount.id == subDiscount.parentDiscount;
            }).cancelled;
        });
        return filteredSubDiscountList;
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
    
    // initiatePayment() {
        
    //     let data = {
    //         appId : '50334e5204e60357816fa8e6d43305',
    //         orderId : (Math.floor(Math.random() * 6) + 1).toString() ,
    //         orderAmount : '1',
    //         orderCurrency: 'INR',
    //         customerName : 'Avinash',
    //         customerPhone : '7050702850',
    //         customerEmail : 'avinash7may@gmail.com',            

    //     }
    //     var callback = function (event) {
    //         var eventName = event.name;
    //         switch(eventName) {
    //           case "PAYMENT_REQUEST":
    //              console.log(event.message);
    //              break;
    //           default:
    //              console.log(event.message);
    //          };
    //     }
        
    //     this.feeService.createObject(this.feeService.parent_transaction,data).then( value => {
    //         console.log('payment token is ' + value)
    //         data['paymentToken']=value;

    //         Cashfree.paySeamless(data, callback);
    //     },
    //     error => {
    //         alert('Something went Wrong!!!')
    //     })
    // }

    starting(data){
        console.log(data)
    }

    initiatePayment() 
    {
        console.log("call backend to initiate payment intent")
    }

}
