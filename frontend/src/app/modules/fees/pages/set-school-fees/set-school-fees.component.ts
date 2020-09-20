import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { SetSchoolFeesServiceAdapter } from "./set-school-fees.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {StudentOldService} from "../../../../services/modules/student/student-old.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {VehicleOldService} from "../../../../services/modules/vehicle/vehicle-old.service";
import {SchoolFeeRule} from "../../../../services/modules/fees/models/school-fee-rule";
import {ClassFilterFee} from "../../../../services/modules/fees/models/class-filter-fee";
import {BusStopFilterFee} from "../../../../services/modules/fees/models/bus-stop-filter-fee";
import {FormControl} from "@angular/forms";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'set-school-fees',
    templateUrl: './set-school-fees.component.html',
    styleUrls: ['./set-school-fees.component.css'],
    providers: [ FeeService, StudentOldService, ClassService, VehicleOldService ],
})

export class SetSchoolFeesComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;

    user;

    feeTypeList: any;
    classList: any;
    sectionList: any;
    busStopList: any;
    studentList: any;

    schoolFeeRuleList: any;
    classFilterFeeList: any;
    busStopFilterFeeList: any;
    studentFeeList: any;
    subFeeReceiptList: any;
    subDiscountList: any;

    lockFees = null;

    selectedFeeType: any;

    newSchoolFeeRule: SchoolFeeRule;
    newClassFilterFeeList: ClassFilterFee[];
    newBusStopFilterFeeList: BusStopFilterFee[];

    selectedClass: any;
    selectedSection: any;
    selectedBusStop: any;

    serviceAdapter: SetSchoolFeesServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                public classService: ClassService,
                public studentService: StudentOldService,
                public vehicleService: VehicleOldService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.initializeNewSchoolFeeRule();
        this.serviceAdapter = new SetSchoolFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
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

    initializeNewSchoolFeeRule(): void {
        this.newSchoolFeeRule = new SchoolFeeRule();
        this.newSchoolFeeRule.parentSession = this.user.activeSchool.currentSessionDbId;
        this.newSchoolFeeRule.isClassFilter = false;
        this.newSchoolFeeRule.isBusStopFilter = false;
        this.newSchoolFeeRule.onlyNewAdmission = false;
        this.newSchoolFeeRule.includeRTE = false;
        this.newSchoolFeeRule.isAnnually = false;
        this.initializeNewClassFilterFeeList();
        this.initializeNewBusStopFilterFeeList();
    }

    initializeNewClassFilterFeeList(): void {
        this.newClassFilterFeeList = [];
    }

    initializeNewBusStopFilterFeeList(): void {
        this.newBusStopFilterFeeList = [];
    }

    changedSelectedFeeType(): void {
        this.initializeNewSchoolFeeRule();
        this.cdRef.detectChanges();
    }

    addToNewClassFilterFeeList(): void {

        let alreadyExists = false;
        this.newClassFilterFeeList.every(classFilterFee => {
            if (classFilterFee.parentClass == this.selectedClass.dbId
                && classFilterFee.parentDivision == this.selectedSection.id) {
                alreadyExists = true;
                return false;
            }
            return true;
        });

        if (alreadyExists) {
            alert(this.selectedClass.name + ', ' + this.selectedSection.name + ' already exists in the list');
            return;
        }

        let classFilterFee = new ClassFilterFee();
        classFilterFee.parentClass = this.selectedClass.dbId;
        classFilterFee.parentDivision = this.selectedSection.id;
        classFilterFee.parentSchoolFeeRule = 0;

        this.newClassFilterFeeList.push(classFilterFee);
    }

    deleteFromNewClassFilterFeeList(classFilterFee: ClassFilterFee): void {
        this.newClassFilterFeeList = this.newClassFilterFeeList.filter(item => {
            return !(item.parentClass == classFilterFee.parentClass && item.parentDivision == classFilterFee.parentDivision);
        });
    }

    addToNewBusStopFilterFeeList(): void {

        let alreadyExists = false;
        this.newBusStopFilterFeeList.every(busStopFilterFee => {
            if (busStopFilterFee.parentBusStop == this.selectedBusStop.id) {
                alreadyExists = true;
                return false;
            }
            return true;
        });

        if (alreadyExists) {
            alert(this.selectedBusStop.stopName  + ' already exists in the list');
            return;
        }

        let busStopFilterFee = new BusStopFilterFee();
        busStopFilterFee.parentBusStop = this.selectedBusStop.id;
        busStopFilterFee.parentSchoolFeeRule = 0;

        this.newBusStopFilterFeeList.push(busStopFilterFee);
    }

    deleteFromNewBusStopFilterFeeList(busStopFilterFee: BusStopFilterFee): void {
        this.newBusStopFilterFeeList = this.newBusStopFilterFeeList.filter(item => {
            return item.parentBusStop != busStopFilterFee.parentBusStop;
        });
    }

    getFilteredSchoolFeeRuleList(): any {
        return this.schoolFeeRuleList.filter( schoolFeeRule => {
            return schoolFeeRule.parentFeeType == this.selectedFeeType.id;
        });
    }

    getClassName(classDbId: number): string {
        return this.classList.find(classs => {
            return classs.id == classDbId;
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

    getExpectedStudentList(): any {
        let tempSchoolFeeRuleIdList = this.schoolFeeRuleList.filter(schoolFeeRule => {
            return schoolFeeRule.parentFeeType == this.selectedFeeType.id;
        }).map(a => a.id);
        let tempStudentIdList = this.studentFeeList.filter(studentFee => {
            return tempSchoolFeeRuleIdList.includes(studentFee.parentSchoolFeeRule);
        }).map(a => a.parentStudent);
        let filteredStudentList = this.studentList.filter(student => {
            if ( tempStudentIdList.indexOf(student.dbId) > -1 ) { return false; }
            if ( this.newSchoolFeeRule.isClassFilter ) {
                let value = this.newClassFilterFeeList.find(classFilterFee => {
                    return classFilterFee.parentClass == student.classDbId
                        && classFilterFee.parentDivision == student.sectionDbId;
                });
                if (value == undefined) {
                    return false;
                }
            }
            if ( this.newSchoolFeeRule.isBusStopFilter ) {
                let value = this.newBusStopFilterFeeList.find(busStopFilterFee => {
                    return busStopFilterFee.parentBusStop == student.busStopDbId;
                });
                if (value == undefined) {
                    return false;
                }
            }
            if ( this.newSchoolFeeRule.onlyNewAdmission ) {
                if (student.admissionSessionDbId != this.user.activeSchool.currentSessionDbId) {
                    return false;
                }
            }
            if ( !this.newSchoolFeeRule.includeRTE ) {
                if (student.rte == "YES") {
                    return false;
                }
            }
            return true;
        });
        return filteredStudentList;
    }

    getDateValue(formattedDate: any): any {
        return new FormControl({value: formattedDate, disabled: true});
    }

    disableSchoolFeeRuleMonthLastDate(schoolFeeRule: any, month: any): boolean {
        if (schoolFeeRule[month+'Amount'] == null || schoolFeeRule[month+'Amount'] == 0) {
            return true;
        }
        return false;
    }

    disableSchoolFeeRuleMonthLateFee(schoolFeeRule: any, month: any): boolean {
        if (schoolFeeRule[month+'Amount'] == null
            || schoolFeeRule[month+'Amount'] == 0
            || schoolFeeRule[month+'LastDate'] == null) {
            return true;
        }
        return false;
    }

    handleNewSchoolFeeRuleAmountChange(newSchoolFeeRule: any, month: any, value: any): void {
        newSchoolFeeRule[month+'Amount'] = value;
        if (value == null || value == 0) {
            newSchoolFeeRule[month+'LastDate'] = null;
            newSchoolFeeRule[month+'LateFee'] = null;
        }
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

    getStudentFeeListBySchoolFeeRule(schoolFeeRule: any): any {
        return this.studentFeeList.filter(studentFee => {
            return studentFee.parentSchoolFeeRule == schoolFeeRule.id;
        });
    }

    getSubFeeReceiptListBySchoolFeeRule(schoolFeeRule: any): any {
        let tempStudentFeeIdList = this.studentFeeList.filter(studentFee => {
            return studentFee.parentSchoolFeeRule == schoolFeeRule.id;
        }).map(a => a.id);
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return tempStudentFeeIdList.includes(subFeeReceipt.parentStudentFee);
        });
    }

    getSubDiscountListBySchoolFeeRule(schoolFeeRule: any): any {
        let tempStudentFeeIdList = this.studentFeeList.filter(studentFee => {
            return studentFee.parentSchoolFeeRule == schoolFeeRule.id;
        }).map(a => a.id);
        return this.subDiscountList.filter(subDiscount => {
            return tempStudentFeeIdList.includes(subDiscount.parentStudentFee);
        });
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
}
