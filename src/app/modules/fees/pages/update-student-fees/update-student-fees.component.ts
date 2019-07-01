import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { UpdateStudentFeesServiceAdapter } from "./update-student-fees.service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {SchoolFeeRule} from "../../../../services/fees/school-fee-rule";
import {ClassFilterFee} from "../../../../services/fees/class-filter-fee";
import {BusStopFilterFee} from "../../../../services/fees/bus-stop-filter-fee";
import {FormControl} from "@angular/forms";
import {StudentFee} from "../../../../services/fees/student-fee";
import {SubFeeReceipt} from "../../../../services/fees/sub-fee-receipt";
import {SubDiscount} from "../../../../services/fees/sub-discount";
import {FeeType} from "../../../../services/fees/fee-type";
import {CommonFunctions} from "../../../../classes/common-functions";
import {ClassService} from "../../../../services/class.service";
import {VehicleService} from "../../../vehicle/vehicle.service";

@Component({
    selector: 'update-student-fees',
    templateUrl: './update-student-fees.component.html',
    styleUrls: ['./update-student-fees.component.css'],
    providers: [ FeeService, ClassService, VehicleService ],
})

export class UpdateStudentFeesComponent implements OnInit {

    installmentList = [
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
        'january',
        'february',
        'march',
    ];

    @Input() user;

    feeTypeList: any;
    schoolFeeRuleList: SchoolFeeRule[];
    classFilterFeeList: ClassFilterFee[];
    busStopFilterFeeList: BusStopFilterFee[];
    classList: any;
    sectionList: any;
    busStopList: any;

    studentFeeList: StudentFee[];
    subFeeReceiptList: SubFeeReceipt[];
    subDiscountList: SubDiscount[];

    lockFees = null;

    selectedFeeType: FeeType;
    selectedStudentFee: StudentFee;
    newStudentFee: StudentFee;

    selectedStudent: any;

    showDetails = false;

    serviceAdapter: UpdateStudentFeesServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                public classService: ClassService,
                public vehicleService: VehicleService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new UpdateStudentFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    handleStudentSelection(student: any): void {
        this.selectedStudent = student;
        if (this.selectedStudent == null) {
            this.showDetails = false;
        } else {
            this.serviceAdapter.getStudentFeeProfile();
            this.selectedFeeType = null;
            this.showDetails = true;
        }
    }

    changeSelectedStudentFee(): void {
        this.selectedStudentFee = this.studentFeeList.find(studentFee => {
            return this.schoolFeeRuleList.filter(schoolFeeRule => {
                return schoolFeeRule.parentFeeType == this.selectedFeeType.id;
            }).map(a => a.id).includes(studentFee.parentSchoolFeeRule);
        });
        this.initializeNewStudentFee();
    }

    initializeNewStudentFee(): void {
        if (this.selectedStudentFee) {
            this.newStudentFee = CommonFunctions.getInstance().copyObject(this.selectedStudentFee);
        } else {
            this.newStudentFee = undefined;
        }
    }

    getSchoolFeeRuleById(schoolFeeRuleId: number): any {
        return this.schoolFeeRuleList.find(item => {
            return item.id == schoolFeeRuleId;
        });
    }

    disableNewStudentFeeInstallmentChange(installment: any): boolean {

        let amount = this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentStudentFee == this.selectedStudentFee.id;
        }).reduce((total, item) => {
            if (item[installment+'Amount']) {
                total += item[installment+'Amount'];
            }
            if (item[installment+'LateFee']) {
                total += item[installment+'LateFee'];
            }
            return total;
        }, 0);

        amount += this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentStudentFee == this.selectedStudentFee.id;
        }).reduce((total, item) => {
            if (item[installment+'Amount']) {
                total += item[installment+'Amount'];
            }
            if (item[installment+'LateFee']) {
                total += item[installment+'LateFee'];
            }
            return total;
        }, 0);

        return amount > 0;

    }

    policeAmountInput(event: any): boolean {
        const value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }


    handleNewStudentFeeAmountChange(installment: any, value: any): void {
        this.newStudentFee[installment+'Amount'] = value;
        if (value == null || value == 0) {
            this.newStudentFee[installment+'LastDate'] = null;
            this.newStudentFee[installment+'LateFee'] = null;
        }
    }

    disableNewStudentFeeMonthLastDate(installment: any): boolean {
        if (this.newStudentFee[installment+'Amount'] == null || this.newStudentFee[installment+'Amount'] == 0) {
            return true;
        }
        return false;
    }

    disableNewStudentFeeMonthLateFee(installment: any): boolean {
        if (this.newStudentFee[installment+'Amount'] == null
            || this.newStudentFee[installment+'Amount'] == 0
            || this.newStudentFee[installment+'LastDate'] == null) {
            return true;
        }
        return false;
    }

    receiptAndDiscountExists(): boolean {
        let amount = this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentStudentFee == this.selectedStudentFee.id;
        }).reduce((total, item) => {
            this.installmentList.forEach(installment => {
                if (item[installment+'Amount']) {
                    total += item[installment+'Amount'];
                }
                if (item[installment+'LateFee']) {
                    total += item[installment+'LateFee'];
                }
            });
            return total;
        }, 0);

        amount += this.subDiscountList.filter(subDiscount => {
            return subDiscount.parentStudentFee == this.selectedStudentFee.id;
        }).reduce((total, item) => {
            this.installmentList.forEach(installment => {
                if (item[installment+'Amount']) {
                    total += item[installment+'Amount'];
                }
                if (item[installment+'LateFee']) {
                    total += item[installment+'LateFee'];
                }
            });
            return total;
        }, 0);

        return amount > 0;
    }

    getSchoolFeeRuleListByFeeType(feeTypeId: number): any {
        return this.schoolFeeRuleList.filter(item => {
            return item.parentFeeType == feeTypeId;
        }).sort( (a,b) => {
            return a.ruleNumber - b.ruleNumber;
        });
    }

    getClassFilterFeeListBySchoolFeeRule(schoolFeeRule: any): any {
        return this.classFilterFeeList.filter(classFilterFee => {
            return classFilterFee.parentSchoolFeeRule == schoolFeeRule.id;
        }).sort((a,b) => {
            let result = 0;
            (a.parentClass != b.parentClass)? result = a.parentClass - b.parentClass : result = a.parentDivision - b.parentDivision;
            return result;
        });
    }

    getBusStopFilterFeeListBySchoolFeeRule(schoolFeeRule: any): any {
        return this.busStopFilterFeeList.filter(busStopFilterFee => {
            return busStopFilterFee.parentSchoolFeeRule == schoolFeeRule.id;
        }).sort((a,b) => {
            return this.getBusStopName(a.parentBusStop).localeCompare(this.getBusStopName(b.parentBusStop));
        });
    }

    getClassName(classDbId: number): string {
        return this.classList.find(classs => {
            return classs.dbId == classDbId;
        }).name;
    }

    getSectionName(sectionDbId: number): string {
        return this.sectionList.find(section => {
            return section.id == sectionDbId;
        }).name;
    }

    getBusStopName(busStopDbId: number): string {
        return this.busStopList.find(busStop => {
            return busStop.id == busStopDbId;
        }).stopName;
    }

    getSchoolFeeRuleTotalAmount(schoolFeeRule: SchoolFeeRule): number {
        let amount = 0;
        if (schoolFeeRule.isAnnually) {
            if (schoolFeeRule.aprilAmount) {
                amount += schoolFeeRule.aprilAmount;
            }
        } else {
            this.installmentList.forEach(installment => {
                if (schoolFeeRule[installment+'Amount']) {
                    amount += schoolFeeRule[installment+'Amount'];
                }
            });
        }
        return amount;
    }

}
