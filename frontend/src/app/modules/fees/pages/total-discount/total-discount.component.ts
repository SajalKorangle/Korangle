import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { TotalDiscountServiceAdapter } from "./total-discount.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {DiscountColumnFilter, INSTALLMENT_LIST} from "../../classes/constants";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {CommonFunctions} from "../../../../classes/common-functions";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'total-discount',
    templateUrl: './total-discount.component.html',
    styleUrls: ['./total-discount.component.css'],
    providers: [ FeeService, EmployeeService, StudentService, ClassService ],
})

export class TotalDiscountComponent implements OnInit {

    // Constants
    discountColumnFilter = new DiscountColumnFilter();
    nullValue = null;
    installmentList = INSTALLMENT_LIST;

     user;

    startDate: any;
    endDate: any;

    feeTypeList = [];
    employeeList = [];
    classList = [];
    sectionList = [];

    discountList: any;
    subDiscountList = [];

    studentList = [];
    studentSectionList = [];

    serviceAdapter: TotalDiscountServiceAdapter;

    selectedEmployee = null;
    selectedModeOfPayment = null;

    isInitialLoading = false;
    isLoading = false;

    constructor(public feeService: FeeService,
                public employeeService: EmployeeService,
                public studentService: StudentService,
                public classService: ClassService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TotalDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.discountColumnFilter.scholarNumber = false;
        this.discountColumnFilter.discountNumber = false;

        if(CommonFunctions.getInstance().isMobileMenu()) {
            this.discountColumnFilter.class = false;
            this.discountColumnFilter.employee = false;
        }

    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getDiscountColumnFilterKeys(): any {
        return Object.keys(this.discountColumnFilter);
    }

    getFilteredEmployeeList(): any {
        let tempEmployeeIdList = this.discountList.map(a => a.parentEmployee);
        tempEmployeeIdList = tempEmployeeIdList.filter((item, index) => {
            return tempEmployeeIdList.indexOf(item) == index;
        });
        return this.employeeList.filter(employee => {
            return tempEmployeeIdList.includes(employee.id);
        });
    }

    getFilteredDiscountList(): any {
        let tempList = this.discountList;
        if (this.selectedEmployee) {
            tempList = tempList.filter(feeReceipt => {
                return feeReceipt.parentEmployee == this.selectedEmployee.id;
            });
        }
        return tempList;
    }

    getFilteredDiscountListTotalAmount(): any {
        return this.getFilteredDiscountList().reduce((total, discount) => {
            return total + this.getDiscountTotalAmount(discount);
        }, 0);
    }

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

}
