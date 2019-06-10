import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { MyCollectionServiceAdapter } from "./my-collection.service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {EmployeeService} from "../../../../services/employee.service";
import {FeeReceipt} from "../../../../services/fees/fee-receipt";
import {SubFeeReceipt} from "../../../../services/fees/sub-fee-receipt";
import {StudentService} from "../../../../services/student.service";
import {ClassService} from "../../../../services/class.service";
import {INSTALLMENT_LIST, ReceiptColumnFilter} from "../../classes/constants";
import {CommonFunctions} from "../../../../classes/common-functions";
import {EmitterService} from "../../../../services/emitter.service";

@Component({
    selector: 'my-collection',
    templateUrl: './my-collection.component.html',
    styleUrls: ['./my-collection.component.css'],
    providers: [ FeeService, EmployeeService, StudentService, ClassService ],
})

export class MyCollectionComponent implements OnInit {

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

    serviceAdapter: MyCollectionServiceAdapter;

    selectedModeOfPayment = null;

    isInitialLoading = false;
    isLoading = false;

    constructor(public feeService: FeeService,
                public employeeService: EmployeeService,
                public studentService: StudentService,
                public classService: ClassService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {

        this.serviceAdapter = new MyCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        delete this.receiptColumnFilter['printButton'];

        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.employee = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.class = false;
            this.receiptColumnFilter.remark = false;
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
            'employeeList': this.employeeList,
            'classList': this.classList,
            'sectionList': this.sectionList,
            'selectedModeOfPayment': this.selectedModeOfPayment,
        };

        EmitterService.get('print-fee-receipt-list').emit(data);

    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.receiptColumnFilter);
    }

    getFilteredModeOfPaymentList(): any {
        let tempList = this.feeReceiptList.map(a => a.modeOfPayment);
        tempList = tempList.filter((item, index) => {
            return tempList.indexOf(item) == index;
        });
        return tempList;
    }

    getFilteredFeeReceiptList(): any {
        let tempList = this.feeReceiptList;
        if (this.selectedModeOfPayment) {
            tempList = this.feeReceiptList.filter(feeReceipt => {
                return feeReceipt.modeOfPayment == this.selectedModeOfPayment;
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
