import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MyCollectionServiceAdapter } from './my-collection.service.adapter';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { INSTALLMENT_LIST, ReceiptColumnFilter } from '../../classes/constants';
import { CommonFunctions } from '../../../../classes/common-functions';
import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'my-collection',
    templateUrl: './my-collection.component.html',
    styleUrls: ['./my-collection.component.css'],
    providers: [FeeService, EmployeeService, StudentService, ClassService, GenericService],
})
export class MyCollectionComponent implements OnInit {
    // Constants
    receiptColumnFilter = new ReceiptColumnFilter();
    nullValue = null;
    installmentList = INSTALLMENT_LIST;

    user;

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

    feeReceiptBookList = [];

    serviceAdapter: MyCollectionServiceAdapter;

    selectedModeOfPayment = null;

    isInitialLoading = false;
    isLoading = false;

    constructor(
        public feeService: FeeService,
        public employeeService: EmployeeService,
        public studentService: StudentService,
        public classService: ClassService,
        public genericService: GenericService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new MyCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        delete this.receiptColumnFilter['printButton'];
        delete this.receiptColumnFilter['session'];

        this.receiptColumnFilter.scholarNumber = false;
        this.receiptColumnFilter.employee = false;

        if (CommonFunctions.getInstance().isMobileMenu()) {
            this.receiptColumnFilter.remark = false;
        }
    }

    printFeeReceiptList(): void {
        let data = {
            receiptColumnFilter: this.receiptColumnFilter,
            feeTypeList: this.feeTypeList,
            feeReceiptList: this.getFilteredFeeReceiptList(),
            subFeeReceiptList: this.subFeeReceiptList,
            studentList: this.studentList,
            studentSectionList: this.studentSectionList,
            employeeList: this.employeeList,
            classList: this.classList,
            sectionList: this.sectionList,
            selectedModeOfPayment: this.selectedModeOfPayment,
        };

        //EmitterService.get('print-fee-receipt-list').emit(data);
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.receiptColumnFilter);
    }

    getFilteredModeOfPaymentList(): any {
        return [...new Set(this.feeReceiptList.map((a) => a.modeOfPayment))].filter((a) => {
            return a != null;
        });
    }

    getFilteredFeeReceiptList(): any {
        let tempList = this.feeReceiptList;
        if (this.selectedModeOfPayment) {
            tempList = this.feeReceiptList.filter((feeReceipt) => {
                return feeReceipt.modeOfPayment == this.selectedModeOfPayment;
            });
        }
        return tempList;
    }

    getFilteredFeeReceiptListTotalAmount(): any {
        return this.getFilteredFeeReceiptList().reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }

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
}
