import {Component, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/modules/class/class.service';
import { StudentService } from "../../../../services/modules/student/student.service";
import { EmployeeService } from "../../../../services/modules/employee/employee.service";
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { SmsService } from "../../../../services/modules/sms/sms.service";

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {SendSmsServiceAdapter} from "./send-sms.service.adapter";
import {NotificationService} from "../../../../services/modules/notification/notification.service";
import {UserService} from "../../../../services/modules/user/user.service";
import { isEmpty } from 'lodash';

@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [ StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService],
})

export class SendSmsComponent implements OnInit {

    user;

    NULL_CONSTANT = null;

    showCustomFilters = false;

    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
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

    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];

    message = '';

    isLoading = false;

    rows;
    timeout: any;

    nameFilter ="" ;

    serviceAdapter: SendSmsServiceAdapter;
    studentFilters: any = {
        category: {
            sc: false,
            st: false,
            obc: false,
            general: false
        },
        gender: {
            male: false,
            female: false,
            other: false
        },
        admission: {
            new: false,
            old: false
        },
        rte: {
            yes: false,
            no: false
        }
    }

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
            this.getFilteredStudentList().filter(x => {return x.selected;}).forEach(studentSection => {
                if (mobileNumberList.indexOf(studentSection.student.mobileNumber) === -1) {
                    mobileNumberList.push(studentSection.student.mobileNumber);
                }
                if (this.includeSecondMobileNumber && this.isMobileNumberValid(studentSection.student.secondMobileNumber)) {
                    if (mobileNumberList.indexOf(studentSection.student.secondMobileNumber) === -1) {
                        mobileNumberList.push(studentSection.student.secondMobileNumber);
                    }
                }
            })
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

    getParameterValue = (student, parameter) => {
        try {
            return this.studentParameterValueList.find(x => x.parentStudent===student.id && x.parentStudentParameter===parameter.id).value
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter(x => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    getFilteredStudentList(): any {
        return this.studentSectionList.filter(studentSection => {
            let student = studentSection.student
            for (let x of this.studentParameterList){
                let flag = x.showNone;
                x.filterValues.forEach(filter => {
                    flag = flag || filter.show;
                })
                if (flag){
                    let parameterValue = this.getParameterValue(student, x);
                    if (parameterValue == this.NULL_CONSTANT && x.showNone) {
                    } else if(!(x.filterValues.filter(filter => filter.show).map(filter => filter.name).includes(parameterValue))){
                        return false;
                    }
                }
            }
            return this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision);
        })
        .filter(studentSection => {
            // category filter
            // If none is checked return all
            if(!this.studentFilters.category.general && !this.studentFilters.category.sc && !this.studentFilters.category.st && !this.studentFilters.category.obc)return true;
            // If something is checked
            if(this.studentFilters.category.general && studentSection.student.newCategoryField==="Gen.")return true;
            if(this.studentFilters.category.sc && studentSection.student.newCategoryField==="SC")return true;
            if(this.studentFilters.category.st && studentSection.student.newCategoryField==="ST")return true;
            if(this.studentFilters.category.obc && studentSection.student.newCategoryField==="OBC")return true;
            // For all other cases
            return false;
        }).filter(studentSection => {
            // gender filter
            // if none selected return all
            if(!this.studentFilters.gender.male && !this.studentFilters.gender.female && !this.studentFilters.gender.other)return true;
            // If something is checked
            if(this.studentFilters.gender.male && studentSection.student.gender=="Male")return true;
            if(this.studentFilters.gender.female && studentSection.student.gender=="Female")return true;
            if(this.studentFilters.gender.other && studentSection.student.gender=="Other")return true;
            // For all other cases
            return false;
        }).filter(studentSection => {
            if(!this.studentFilters.admission.new && !this.studentFilters.admission.old)return true;
            // admission new or old
            if(studentSection.student.admissionSession===this.user.activeSchool.currentSessionDbId && this.studentFilters.admission.new)return true;
            if(studentSection.student.admissionSession!==this.user.activeSchool.currentSessionDbId && this.studentFilters.admission.old)return true;
            return false;
        }).filter(studentSection => {
            if(!this.studentFilters.rte.yes && !this.studentFilters.rte.no)return true;
            // rte yes or no
            if(studentSection.student.rte==="YES" && this.studentFilters.rte.yes)return true;
            if(studentSection.student.rte==="NO" && this.studentFilters.rte.no)return true;
            return false;
        }).filter(studentSection =>{

            this.nameFilter = this.nameFilter.toString().toLowerCase().trim();

            return studentSection.student.name.toLowerCase().indexOf(this.nameFilter)!=-1
            || studentSection.student.fathersName.toLowerCase().indexOf(this.nameFilter)!=-1
            || studentSection.student.name.toLowerCase().indexOf(this.nameFilter)!=-1
            || isEmpty(this.nameFilter);
           
        })
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

    getSelectedStudentNumber = () => {
        // console.log(this.getFilteredStudentList().reduce((acc,x) => acc+x.selected?1:0, 0))
        return this.getFilteredStudentList().reduce((acc,x) => {
            return x.selected?acc+1:acc
        }, 0)
    }

    getDisplayStudentNumber = () => this.getFilteredStudentList().length;

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
            return classSection['class'].id == classId && classSection['section'].id == sectionId;
        }).selected;
    }

    getClassSectionName(classId: number, sectionId: number): string {
        let classSection = this.classSectionList.find(classSection => {
            return classSection.class.id == classId && classSection.section.id == sectionId;
        });
        let multipleSections = this.classSectionList.filter(classSection => {
            return classSection.class.id == classId;
        }).length > 1;
        return classSection.class.name + (multipleSections?', '+classSection.section.name:'');
    }

}
