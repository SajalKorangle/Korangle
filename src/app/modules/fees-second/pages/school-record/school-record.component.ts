import {Component, Input, OnInit} from '@angular/core';

import {FeeOldService} from '../../fee-old.service';
import {ClassService} from '../../../../services/class.service';
import {FREQUENCY_LIST} from '../../classes/constants';
import {ExcelService} from "../../../../excel/excel-service";

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showClassName = true;
    showFathersName = true;
    showMobileNumber = true;
    showSecondMobileNumber = true;
    showScholarNumber = true;
    showFeesDue = true;
    showRTE = true;
}

@Component({
    selector: 'app-school-fee-record',
    templateUrl: './school-record.component.html',
    styleUrls: ['./school-record.component.css', './school-record.component.scss'],
    providers: [FeeOldService, ClassService],
})

export class SchoolRecordComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    displayStudentNumber = 0;
    totalStudents = 0;

    studentFeeDuesList = [];

    classSectionList = [];

    isLoading = false;

    frequencyList = FREQUENCY_LIST;

    constructor(private feeService: FeeOldService,
                private excelService: ExcelService,
                private classService: ClassService) {
    }

    ngOnInit(): void {
        this.columnFilter = new ColumnFilter();
        const student_fee_dues_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        }
        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
            this.feeService.getStudentFeeDuesList(student_fee_dues_request_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            console.log(value);
            this.initializeClassSectionList(value[0]);
            this.initializeStudentFeeDuesList(value[1]);
        }, error => {
            this.isLoading = false;
        });
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach(classs => {
            classs.sectionList.forEach(section => {
                section.selected = true;
                section.containsStudent = false;
            });
        });
    }

    initializeStudentFeeDuesList(studentFeeDuesList: any): void {
        /*this.studentFeeDuesList = studentFeeDuesList.filter(student => {
            return student.parentTransferCertificate === null;
        });*/
        this.studentFeeDuesList = studentFeeDuesList;
        this.studentFeeDuesList.forEach(studentFeeDues => {
            studentFeeDues['sectionObject'] = this.getSectionObject(studentFeeDues.classDbId, studentFeeDues.sectionDbId);
            studentFeeDues['studentFeeProfile'] = null;
            studentFeeDues['show'] = true;
        });
    }

    getFilteredStudentTotalFeeDues(): any {
        let totalFeeDues = 0;
        this.studentFeeDuesList.forEach(student => {
            if (student.sectionObject.selected && student.parentTransferCertificate === null) {
                totalFeeDues += student.feesDue;
            }
        });
        return totalFeeDues;
    }

    getFilteredStudentFeeDuesList(): any {
        return this.studentFeeDuesList.filter(student => {
            if (student.sectionObject.selected && student.parentTransferCertificate === null) {
                return true;
            } else {
                return false;
            }
        });
    }

    getSectionObject(classDbId: number, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (sectionDbId === section.dbId && classDbId === classs.dbId) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
        return sectionObject;
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    };

    selectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
    };

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    };

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    };

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every(section => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    printStudentList(): void {
        const value = {
            studentList: this.getFilteredStudentFeeDuesList(),
            columnFilter: this.columnFilter
        };
        //Getting removved. No refactoring
        //EmitterService.get('print-student-list').emit(value);
    }

    downloadList(): void {

        let template: any;

        template = [

            this.getHeaderValues(),

            /*SECTION_VALUES,

            ADMISSION_SESSION_VALUES,

            GENDER_VALUES,

            CATEGORY_VALUES,

            RELIGION_VALUES,

            BLOOD_GROUP_VALUES,

            RTE_VALUES,

            ['Bus Stop Values'].concat(this.busStopList.map(a => a.stopName)),

            ['Date Format', 'dd-mm-yyyy or dd/mm/yyyy'],

            HEADERS,*/

        ];

        let count = 0;
        this.getFilteredStudentFeeDuesList().forEach(student => {
            student.serialNumber = ++count;
            template.push(this.getStudentDisplayInfo(student));
        });

        this.excelService.downloadFile(template, 'korangle_student_fees.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        (this.columnFilter.showSerialNumber)? headerValues.push('Serial No.'): '';
        (this.columnFilter.showName)? headerValues.push('Name'): '';
        (this.columnFilter.showClassName)? headerValues.push('Class Name'): '';
        (this.columnFilter.showFathersName)? headerValues.push('Father\'s Name'): '';
        (this.columnFilter.showMobileNumber)? headerValues.push('Mobile No.'): '';
        (this.columnFilter.showSecondMobileNumber)? headerValues.push('Alt. Mobile No.'): '';
        (this.columnFilter.showScholarNumber)? headerValues.push('Scholar No.'): '';
        (this.columnFilter.showRTE)? headerValues.push('RTE'): '';
        (this.columnFilter.showFeesDue)? headerValues.push('Fees Due'): '';
        return headerValues;
    }

    getStudentDisplayInfo(student: any): any {
        let studentDisplay = [];
        (this.columnFilter.showSerialNumber)? studentDisplay.push(student.serialNumber): '';
        (this.columnFilter.showName)? studentDisplay.push(student.name): '';
        (this.columnFilter.showClassName)? studentDisplay.push(student.className): '';
        (this.columnFilter.showFathersName)? studentDisplay.push(student.fathersName): '';
        (this.columnFilter.showMobileNumber)? studentDisplay.push(student.mobileNumber): '';
        (this.columnFilter.showSecondMobileNumber)? studentDisplay.push(student.secondMobileNumber): '';
        (this.columnFilter.showScholarNumber)? studentDisplay.push(student.scholarNumber): '';
        (this.columnFilter.showRTE)? studentDisplay.push(student.rte): '';
        (this.columnFilter.showFeesDue)? studentDisplay.push(student.feesDue): '';
        return studentDisplay;
    }

    // For Student Fee Profile

    getStudentFeeProfile(student: any): void {
        student.studentFeeProfile = null;
        const data = {
            studentDbId: student.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        this.feeService.getStudentFeeProfile(data, this.user.jwt).then( studentFeeProfile => {
            if (student.dbId === data['studentDbId']) {
                student.studentFeeProfile = studentFeeProfile;
            }
        }, error => {
            alert('error');
        });
    }

    showSessionFeesLine(student: any): boolean {
        let number = 0;
        student['studentFeeProfile']['sessionFeeStatusList'].forEach(sessionFeeStatus => {
            if (this.getSessionFeesDue(sessionFeeStatus) > 0) {
                number += 1;
            }
        });
        return number > 1;
    }

    getStudentFeesDue(student: any): number {
        let amountDue = 0;
        student['studentFeeProfile']['sessionFeeStatusList'].forEach(sessionFeeStatus => {
            amountDue += this.getSessionFeesDue(sessionFeeStatus);
        });
        return amountDue;
    }

    getSessionFeesDue(sessionFeeStatus: any): number {
        let amountDue = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amountDue += this.getComponentFeesDue(component);
        });
        return amountDue;
    }

    getComponentFeesDue(component: any): number {
        let amountDue = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amountDue += component.amountDue;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                // amountDue += componentMonthly.amountDue;
                amountDue += this.getComponentMonthlyFeesDue(componentMonthly);
            });
        }
        return amountDue;
    }

    getComponentMonthlyFeesDue(componentMonthly: any): number {
        return componentMonthly.amountDue;
    }


    // For Student Total Fee

    getStudentTotalFee(student: any): number {
        let amount = 0;
        student['studentFeeProfile']['sessionFeeStatusList'].forEach(sessionFeeStatus => {
            if (this.getSessionFeesDue(sessionFeeStatus) > 0) {
                amount += this.getSessionTotalFee(sessionFeeStatus);
            }
        });
        return amount;
    }

    getSessionTotalFee(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += this.getComponentTotalFee(component);
        });
        return amount;
    }

    getComponentTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amount += component.amount;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                // amount += componentMonthly.amount;
                amount += this.getComponentMonthlyTotalFee(componentMonthly);
            });
        }
        return amount;
    }

    getComponentMonthlyTotalFee(componentMonthly: any): number {
        return componentMonthly.amount;
    }

}
