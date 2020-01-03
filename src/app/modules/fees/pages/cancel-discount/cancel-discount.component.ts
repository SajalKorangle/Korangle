import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CancelDiscountServiceAdapter } from "./cancel-discount.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {FormControl} from "@angular/forms";
import {ClassOldService} from "../../../../services/modules/class/class-old.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'cancel-discount',
    templateUrl: './cancel-discount.component.html',
    styleUrls: ['./cancel-discount.component.css'],
    providers: [ FeeService, ClassOldService, ClassService, StudentService, EmployeeService ],
})

export class CancelDiscountComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;

    user;

    searchParameter = new FormControl();

    discountList: any;
    subDiscountList = [];
    studentList = [];
    studentSectionList = [];
    classList = [];
    sectionList = [];
    employeeList = [];

    serviceAdapter: CancelDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                public classOldService: ClassOldService,
                public classService : ClassService,
                public studentService: StudentService,
                public employeeService: EmployeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CancelDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    getEmployeeName(discount: any): any {
        let employee = this.employeeList.find(employee => {
            return employee.id == discount.parentEmployee;
        });
        return employee?employee.name:null;
    }

    getStudent(discount: any): any {
        return this.studentList.find(student => {
            return student.id == discount.parentStudent;
        });
    }

    getDiscountTotalAmount(discount: any): number {
        return this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentDiscount == discount.id;
        }).reduce((total, subDiscount) => {
            return total + this.installmentList.reduce((amount, installment) => {
                return amount
                    + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                    + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

}
