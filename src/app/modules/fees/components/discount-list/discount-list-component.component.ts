import { Component, Input } from '@angular/core';
import {INSTALLMENT_LIST} from "../../classes/constants";
import {SESSION_LIST} from "../../../../classes/constants/session";

// import {EmitterService} from '../../services/emitter.service';

@Component({
    selector: 'app-discount-list',
    templateUrl: './discount-list-component.component.html',
    styleUrls: ['./discount-list-component.component.css'],
})
export class DiscountListComponent {

    @Input() user;
    @Input() discountColumnFilter;
    @Input() feeTypeList;
    @Input() discountList;
    @Input() subDiscountList;
    @Input() studentList;
    @Input() studentSectionList;
    @Input() classList;
    @Input() sectionList;
    @Input() employeeList;
    @Input() number = 3;

    // Constant Lists
    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;

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

    increaseNumber(): void {
        this.number += 3;
    }

    getStudentName(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        }).name;
    }

    getStudentScholarNumber(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        }).scholarNumber;
    }

    getClassName(studentId: any, sessionId: any): any {
        return this.classList.find(classs => {
            return classs.dbId == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentClass;
        }).name;
    }

    getSectionName(studentId: any, sessionId: any): any {
        return this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentDivision;
        }).name;
    }

    getEmployeeName(discount: any): any {
        let employee = this.employeeList.find(employee => {
            return employee.id == discount.parentEmployee;
        });
        return employee?employee.name:null;
    }

}
