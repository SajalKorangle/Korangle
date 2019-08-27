import {Component, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/class.service';
import { StudentService } from "../../../../services/student.service";
import { EmployeeService } from "../../../../services/employee.service";
import { SmsOldService } from '../../sms-old.service';
import { SmsService } from "../../../../services/sms/sms.service";

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {SendSmsServiceAdapter} from "./send-sms.service.adapter";
import {NotificationService} from "../../../../services/notification/notification.service";
import {UserService} from "../../../../services/user/user.service";

@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [ StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService],
})

export class SendSmsComponent implements OnInit {

    user;

    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'BOTH',
    ];

    selectedSentType = 'SMS';

    includeSecondMobileNumber = false;

    employeeList = [];

    displayStudentNumber = 0;

    classSectionList = [];
    studentSectionList = [];

    studentList = [];

    gcmDeviceList = [];
    filteredUserList = [];

    smsBalance = 0;

    showStudentList = false;
    showEmployeeList = false;

    smsMobileNumberList = [];
    notificationMobileNumberList = [];

    message = '';

    isLoading = false;

    rows;
    timeout: any;

    serviceAdapter: SendSmsServiceAdapter;

    constructor(public studentService: StudentService,
                public employeeService: EmployeeService,
                public classService: ClassService,
                public smsOldService: SmsOldService,
                public smsService: SmsService,
                public notificationService: NotificationService,
                public userService: UserService,
                private cdRef: ChangeDetectorRef) { }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    getRowHeight(row) {
        return 50;
    }

    getRowClass(row): any {
        return {
            'hoverRow': true,
        };
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
        this.cdRef.detectChanges();
    }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SendSmsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    getMobileNumberList(returnType: string): any {
        let mobileNumberList = [];
        if (this.showStudentList) {
            this.studentSectionList.forEach(studentSection => {
                if (this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision) && studentSection.selected) {
                    if (mobileNumberList.indexOf(studentSection.student.mobileNumber) === -1) {
                        mobileNumberList.push(studentSection.student.mobileNumber);
                    }
                    if (this.includeSecondMobileNumber && this.isMobileNumberValid(studentSection.student.secondMobileNumber)) {
                        if (mobileNumberList.indexOf(studentSection.student.secondMobileNumber) === -1) {
                            mobileNumberList.push(studentSection.student.secondMobileNumber);
                        }
                    }
                }
            });
        }
        if (this.showEmployeeList) {
            this.employeeList.forEach(employee => {
                if (employee.selected) {
                    if (mobileNumberList.indexOf(employee.mobileNumber) === -1) {
                        mobileNumberList.push(employee.mobileNumber);
                    }
                }
            });
        }
        if (this.selectedSentType == this.sentTypeList[0]) {
            this.smsMobileNumberList = mobileNumberList;
            this.notificationMobileNumberList = [];
        } else if (this.selectedSentType == this.sentTypeList[1]) {
            this.smsMobileNumberList = [];
            this.notificationMobileNumberList = mobileNumberList.filter(mobileNumber => {
                return this.filteredUserList.find(user => {
                    return user.username == mobileNumber.toString();
                }) != undefined;
            });
        } else if (this.selectedSentType == this.sentTypeList[2]) {
            this.notificationMobileNumberList = mobileNumberList.filter(mobileNumber => {
                return this.filteredUserList.find(user => {
                    return user.username == mobileNumber.toString();
                }) != undefined;
            });
            this.smsMobileNumberList = mobileNumberList.filter(mobileNumber => {
                return this.notificationMobileNumberList.find(mobileNumber2 => {
                    return mobileNumber == mobileNumber2;
                }) == undefined;
            });
        } else {
            alert('Error');
        }
        if (returnType == 'sms') {
            return this.smsMobileNumberList;
        } else if (returnType == 'notification') {
            return this.notificationMobileNumberList;
        } else if (returnType == 'both') {
            return this.smsMobileNumberList.concat(this.notificationMobileNumberList);
        } else {
            alert('error');
            return null;
        }
    }

    hasUnicode(): boolean {
        for (let i=0; i<this.message.length; ++i) {
            if (this.message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getSMSCount(): number {
        if (this.hasUnicode()) {
            return Math.ceil(this.message.length/70);
        } else {
            return Math.ceil(this.message.length/160);
        }
    }

    isMobileNumberValid(mobileNumber: any): boolean {
        if (mobileNumber === null) {
            return false;
        }
        if (mobileNumber === '') {
            return false;
        }
        if (typeof mobileNumber !== 'number') {
            return false;
        }
        if (mobileNumber<1000000000) {
            return false;
        }
        if (mobileNumber>9999999999) {
            return false;
        }
        return true;
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach(classSection => {
            classSection['selected'] = false;
        });
    };

    selectAllClasses(): void {
        this.classSectionList.forEach(classSection => {
            classSection['selected'] = true;
        });
    };

    selectAllStudents(): void {
        this.studentSectionList.forEach(studentSection => {
            if (studentSection.validMobileNumber) {
                studentSection.selected = true;
            }
        })
    }

    unSelectAllStudents(): void {
        this.studentSectionList.forEach(studentSection => {
            studentSection.selected = false;
        })
    }

    getFilteredStudentList(): any {
        return this.studentSectionList.filter(studentSection => {
            return this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision);
        });
    }

    selectAllEmployees(): void {
        this.employeeList.forEach(employee => {
            if(employee.validMobileNumber) {
                employee.selected = true;
            }
        });
    }

    unSelectAllEmployees(): void {
        this.employeeList.forEach(employee => {
            employee.selected = false;
        });
    }

    getSelectedStudentNumber(): number {
        let result = 0;
        this.studentSectionList.forEach(studentSection => {
            if (this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision) && studentSection.selected) {
                ++result;
            }
        });
        return result;
    }

    getDisplayStudentNumber(): number {
        let result = 0;
        this.studentSectionList.forEach(studentSection => {
            if (this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision)) {
                ++result;
            }
        });
        return result;
    }

    getSelectedEmployeeNumber(): number {
        let result = 0;
        this.employeeList.forEach(employee => {
            if (employee.selected) {
                ++result;
            }
        });
        return result;
    }

    isClassSectionSelected(classId: number, sectionId: number): boolean {
        return this.classSectionList.find(classSection => {
            return classSection['class'].dbId == classId && classSection['section'].id == sectionId;
        }).selected;
    }

    getClassSectionName(classId: number, sectionId: number): string {
        let classSection = this.classSectionList.find(classSection => {
            return classSection.class.dbId == classId && classSection.section.id == sectionId;
        });
        let multipleSections = this.classSectionList.filter(classSection => {
            return classSection.class.dbId == classId;
        }).length > 1;
        return classSection.class.name + (multipleSections?', '+classSection.section.name:'');
    }

}
