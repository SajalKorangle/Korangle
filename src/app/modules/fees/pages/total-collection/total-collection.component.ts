import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { TotalCollectionServiceAdapter } from "./total-collection.service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {EmployeeService} from "../../../../services/employee.service";
import {StudentService} from "../../../../services/student.service";
import {ClassService} from "../../../../services/class.service";
import {INSTALLMENT_LIST, ReceiptColumnFilter} from "../../classes/constants";
import {CommonFunctions} from "../../../../classes/common-functions";
import { PrintService } from '../../../../print/print-service';
import { PRINT_FEE_RECIEPT_LIST } from '../../../../print/print-routes.constants';

@Component({
    selector: 'total-collection',
    templateUrl: './total-collection.component.html',
    styleUrls: ['./total-collection.component.css'],
    providers: [ FeeService, EmployeeService, StudentService, ClassService ],
})

export class TotalCollectionComponent implements OnInit {

    // Constants
    receiptColumnFilter = new ReceiptColumnFilter();
    nullValue = null;
    installmentList = INSTALLMENT_LIST;

    @Input() user;

    startDate: any;
    endDate: any;

    feeTypeList = [];
    employeeList = [];
    classList = [];
    sectionList = [];

    feeReceiptList: any;
    subFeeReceiptList = [];

    studentList = [];
    studentSectionList = [];
    serviceAdapter: TotalCollectionServiceAdapter;

    selectedEmployee = null;
    selectedModeOfPayment = null;
    selectedClass=null;

    isInitialLoading = false;
    isLoading = false;

    constructor(public feeService: FeeService,
                public employeeService: EmployeeService,
                public studentService: StudentService,
                public classService: ClassService,
                private cdRef: ChangeDetectorRef,
                private printService: PrintService) {}

    ngOnInit(): void {

        this.serviceAdapter = new TotalCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        delete this.receiptColumnFilter['printButton'];

        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.remark = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.class = false;
            this.receiptColumnFilter.remark = false;
            this.receiptColumnFilter.employee = false;
        }

    }

    printFeeReceiptList(): void {

        let data = {
            'receiptColumnFilter': this.receiptColumnFilter,
            'feeTypeList': this.feeTypeList,
            'feeReceiptList': this.getFilteredFeeReceiptList(),
            'subFeeReceiptList': this.subFeeReceiptList,
            'studentList': this.studentList,
            'studentSectionList': this.studentSectionList,
            'employeeList': this.getFilteredEmployeeList(),
            'classList': this.classList,
            'sectionList': this.sectionList,
            'selectedEmployee': this.selectedEmployee,
            'selectedModeOfPayment': this.selectedModeOfPayment,
        };

        this.printService.navigateToPrintRoute(PRINT_FEE_RECIEPT_LIST, {user: this.user, value: data});
    }

    getClassName(studentId: any, sessionId: any): string {
        return  this.classList.find(classs => {
            return classs.dbId == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentClass;
        }).name;
    }

    getSectionName(studentId: any, sessionId: any): string{
        return this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentDivision;
        }).name;
    }

    getClassAndSectionName(studentId: any, sessionId: any): string{
        const className=this.getClassName(studentId,sessionId);
        const sectionName=this.getSectionName(studentId,sessionId);
        return className+','+sectionName;
    }

    getFilteredClassList(){
        let tempClassList = this.feeReceiptList.map(fee=>{
            return this.getClassAndSectionName(fee.parentStudent,fee.parentSession);
        });
        tempClassList = tempClassList.filter((item, index) => {
            return tempClassList.indexOf(item) == index;
        });
        return tempClassList;
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.receiptColumnFilter);
    }

    getFilteredEmployeeList(): any {
        let tempEmployeeIdList = this.feeReceiptList.map(a => a.parentEmployee);
        tempEmployeeIdList = tempEmployeeIdList.filter((item, index) => {
            return tempEmployeeIdList.indexOf(item) == index;
        });
        return this.employeeList.filter(employee => {
            return tempEmployeeIdList.includes(employee.id);
        });
    }

    getFilteredModeOfPaymentList(): any {
        return [...new Set(this.feeReceiptList.map(a => a.modeOfPayment))].filter(a => {return a != null;});
    }

    getFilteredFeeReceiptList(): any {
        let tempList = this.feeReceiptList;
        if (this.selectedEmployee) {
            tempList = tempList.filter(feeReceipt => {
                return feeReceipt.parentEmployee == this.selectedEmployee.id;
            });
        }
        if (this.selectedModeOfPayment) {
            tempList = tempList.filter(feeReceipt => {
                return feeReceipt.modeOfPayment == this.selectedModeOfPayment;
            })
        }
        if (this.selectedClass) {
            tempList = tempList.filter(feeReceipt => {
                return this.getClassAndSectionName(feeReceipt.parentStudent,feeReceipt.parentSession)== this.selectedClass;
            })
        }
        return tempList;
    }

    getFilteredFeeReceiptListTotalAmount(): any {
        return this.getFilteredFeeReceiptList().reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }

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

}
