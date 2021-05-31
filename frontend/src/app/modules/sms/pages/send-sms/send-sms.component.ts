import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/modules/class/class.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {EmployeeService} from '../../../../services/modules/employee/employee.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {DataStorage} from '../../../../classes/data-storage';
import {SendSmsServiceAdapter} from './send-sms.service.adapter';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {UserService} from '../../../../services/modules/user/user.service';
import {UpdateService} from '../../../../update/update-service';
import moment = require('moment');
import {SendSmsHtmlRenderer} from '@modules/sms/pages/send-sms/send-sms.html.renderer';
import {SENT_UPDATE_TYPE} from '@modules/sms/classes/constants';

@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService],
})
export class SendSmsComponent implements OnInit {
    user;

    serviceAdapter: SendSmsServiceAdapter;
    htmlRenderer: SendSmsHtmlRenderer;

    NULL_CONSTANT = null;

    showFilters = false;
    includeSecondMobileNumber = false;
    invalidmobilenumber = false;

    displayStudentNumber = 0;

    sentTypeList = SENT_UPDATE_TYPE;
    sendToList = ['Students', 'Employees'];

    employeeList = [];
    populatedTemplateList = [];
    classSectionList = [];
    studentSectionList = [];
    smsPersonList = [];
    notificationPersonList = [];
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];

    variableRegex = /\B@([\w+\\#%*(){}.,$!=\-/[\]]?)+/g;

    studentUpdateService: any;
    employeeUpdateService: any;

    rows;
    timeout: any;
    nameFilter = '';
    message = '';

    stateKeeper = {
        isLoading: false
    };

    userInput = {
        selectedSendTo: null,
        selectedTemplate: {} as any,
        selectedSentType: SENT_UPDATE_TYPE[1],
    };

    backendData = {
        templateList: [],
        smsIdList: [],
        smsIdSchool: [],
        eventSettingList: [],
        studentList: [],
        classList: [],
        sectionList: [],
        smsEvent: {} as any,
        smsBalance: 0,
    };

    studentFilters: any = {
        category: {
            sc: false,
            st: false,
            obc: false,
            general: false,
        },
        gender: {
            male: false,
            female: false,
            other: false,
        },
        admission: {
            new: false,
            old: false,
        },
        rte: {
            yes: false,
            no: false,
        },
    };

    constructor(
        public studentService: StudentService,
        public employeeService: EmployeeService,
        public classService: ClassService,
        public smsOldService: SmsOldService,
        public smsService: SmsService,
        public notificationService: NotificationService,
        public userService: UserService,
        private cdRef: ChangeDetectorRef
    ) {
    }

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
        if (row.validMobileNumber) {
            return {
                hoverRow: true,
            };
        } else {
            return {
                highlight: true,
            };
        }
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
        this.cdRef.detectChanges();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.studentUpdateService = new UpdateService(this.notificationService, this.userService, this.smsService);
        this.employeeUpdateService = new UpdateService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new SendSmsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new SendSmsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }

    getMobileNumberList(returnType: string): any {
        let tempList = [];
        if (this.userInput.selectedSendTo == this.sendToList[0]) {
            this.getFilteredStudentList()
                .filter((x) => {
                    return x.selected;
                })
                .forEach((studentSection) => {
                    let duplicate = tempList.find(temp => temp.mobileNumber == studentSection.student.mobileNumber);
                    if (duplicate != undefined) {
                        let duplicateMappedData = this.studentUpdateService.getMessageFromTemplate(this.message, this.getMappingData(duplicate));
                        let orgMappedData = this.studentUpdateService.getMessageFromTemplate(this.message, this.getMappingData(studentSection.student));
                        if (duplicateMappedData != orgMappedData) {
                            tempList.push(studentSection.student);
                        }
                    } else {
                        tempList.push(studentSection.student);
                    }
                    if (this.includeSecondMobileNumber && this.isMobileNumberValid(studentSection.student.secondMobileNumber)) {
                        duplicate = tempList.find(temp => temp.mobileNumber == studentSection.student.secondMobileNumber);
                        let tempStudent = JSON.parse(JSON.stringify(studentSection.student));
                        tempStudent.mobileNumber = studentSection.student.secondMobileNumber;
                        if (duplicate != undefined) {
                            let dMappedData = this.studentUpdateService.getMessageFromTemplate(this.message, this.getMappingData(duplicate));
                            let oMappedData = this.studentUpdateService.getMessageFromTemplate(this.message, this.getMappingData(studentSection.student));
                            if (dMappedData != oMappedData) {
                                tempList.push(tempStudent);
                            }
                        } else {
                            tempList.push(tempStudent);
                        }
                    }
                });
        }
        if (this.userInput.selectedSendTo == this.sendToList[1]) {
            this.employeeList.forEach((employee) => {
                if (employee.selected) {
                    tempList.push(employee);
                }
            });
        }
        if (this.userInput.selectedSentType.id == 2) {
            this.smsPersonList = tempList;
            this.notificationPersonList = [];
        } else if (this.userInput.selectedSentType.id == 3) {
            this.smsPersonList = [];
            this.notificationPersonList = tempList.filter((temp) => temp.notification);
        } else if (this.userInput.selectedSentType.id == 3) {
            this.notificationPersonList = tempList.filter((temp) => temp.notification);
            this.smsPersonList = tempList.filter((temp1) => {
                return (
                    this.notificationPersonList.find((temp2) => {
                        return temp1.mobileNumber == temp2.mobileNumber;
                    }) == undefined
                );
            });
        } else {
            alert('Error');
        }
        if (returnType == 'sms') {
            return this.smsPersonList;
        } else if (returnType == 'notification') {
            return this.notificationPersonList;
        } else if (returnType == 'both') {
            return this.smsPersonList.concat(this.notificationPersonList);
        } else {
            alert('error');
            return null;
        }
    }

    hasUnicode(): boolean {
        for (let i = 0; i < this.message.length; ++i) {
            if (this.message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
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
        if (mobileNumber < 1000000000) {
            return false;
        }
        if (mobileNumber > 9999999999) {
            return false;
        }
        return true;
    }


    getParameterValue = (student, parameter) => {
        try {
            return this.studentParameterValueList.find((x) => x.parentStudent === student.id && x.parentStudentParameter === parameter.id)
                .value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    getFilteredStudentList(): any {
        return this.studentSectionList
            .filter((studentSection) => {
                let student = studentSection.student;
                for (let x of this.studentParameterList) {
                    let flag = x.showNone;
                    x.filterValues.forEach((filter) => {
                        flag = flag || filter.show;
                    });
                    if (flag) {
                        let parameterValue = this.getParameterValue(student, x);
                        if (parameterValue == this.NULL_CONSTANT && x.showNone) {
                        } else if (
                            !x.filterValues
                                .filter((filter) => filter.show)
                                .map((filter) => filter.name)
                                .includes(parameterValue)
                        ) {
                            return false;
                        }
                    }
                }
                return this.isClassSectionSelected(studentSection.parentClass, studentSection.parentDivision);
            })
            .filter((studentSection) => {
                // category filter
                // If none is checked return all
                if (
                    !this.studentFilters.category.general &&
                    !this.studentFilters.category.sc &&
                    !this.studentFilters.category.st &&
                    !this.studentFilters.category.obc
                ) {
                    return true;
                }
                // If something is checked
                if (this.studentFilters.category.general && studentSection.student.newCategoryField === 'Gen.') {
                    return true;
                }
                if (this.studentFilters.category.sc && studentSection.student.newCategoryField === 'SC') {
                    return true;
                }
                if (this.studentFilters.category.st && studentSection.student.newCategoryField === 'ST') {
                    return true;
                }
                if (this.studentFilters.category.obc && studentSection.student.newCategoryField === 'OBC') {
                    return true;
                }
                // For all other cases
                return false;
            })
            .filter((studentSection) => {
                // gender filter
                // if none selected return all
                if (!this.studentFilters.gender.male && !this.studentFilters.gender.female && !this.studentFilters.gender.other) {
                    return true;
                }
                // If something is checked
                if (this.studentFilters.gender.male && studentSection.student.gender == 'Male') {
                    return true;
                }
                if (this.studentFilters.gender.female && studentSection.student.gender == 'Female') {
                    return true;
                }
                if (this.studentFilters.gender.other && studentSection.student.gender == 'Other') {
                    return true;
                }
                // For all other cases
                return false;
            })
            .filter((studentSection) => {
                if (!this.studentFilters.admission.new && !this.studentFilters.admission.old) {
                    return true;
                }
                // admission new or old
                if (
                    studentSection.student.admissionSession === this.user.activeSchool.currentSessionDbId &&
                    this.studentFilters.admission.new
                ) {
                    return true;
                }
                if (
                    studentSection.student.admissionSession !== this.user.activeSchool.currentSessionDbId &&
                    this.studentFilters.admission.old
                ) {
                    return true;
                }
                return false;
            })
            .filter((studentSection) => {
                if (!this.studentFilters.rte.yes && !this.studentFilters.rte.no) {
                    return true;
                }
                // rte yes or no
                if (studentSection.student.rte === 'YES' && this.studentFilters.rte.yes) {
                    return true;
                }
                if (studentSection.student.rte === 'NO' && this.studentFilters.rte.no) {
                    return true;
                }
                return false;
            })
            .filter((studentSection) => {
                // by student's or father's name
                this.nameFilter = this.nameFilter.toString().toLowerCase().replace(/^\s+/gm, '');

                return (
                    this.nameFilter === '' ||
                    studentSection.student.name.toLowerCase().indexOf(this.nameFilter) === 0 ||
                    studentSection.student.fathersName.toLowerCase().indexOf(this.nameFilter) === 0
                );
            })
            .filter((studentSection) => {
                if (!(this.invalidmobilenumber && this.isMobileNumberValid(studentSection.student.mobileNumber))) {
                    return true;
                }
                return false;
            });
    }


    isClassSectionSelected(classId: number, sectionId: number): boolean {
        return this.classSectionList.find((classSection) => {
            return classSection['class'].id == classId && classSection['section'].id == sectionId;
        }).selected;
    }

    getMappingData(person: any): any {
        let temp = {};
        temp['schoolName'] = this.user.activeSchool.printName;
        temp['notification'] = person.notification;
        temp['date'] = moment(new Date()).format('DD/MM/YYYY');
        if (this.userInput.selectedSendTo == this.sendToList[0]) {
            temp['studentName'] = person.name;
            temp['studentScholarNumber'] = person.scholarNumber;
            let studentSection = this.studentSectionList.find(studSec => studSec.parentStudent == person.id);
            let classs = this.classSectionList.find(classSec => classSec.class.id == studentSection.parentClass
                && classSec.section.id == studentSection.parentDivision);
            temp['class'] = classs.class.name + ', ' + classs.section.name;
            temp['fathersName'] = person.fathersName ? person.fathersName : '';
        } else if (this.userInput.selectedSendTo == this.sendToList[1]) {
            console.log(person);
            temp['employeeName'] = person.name;
        }
        temp['mobileNumber'] = person.mobileNumber;
        return temp;
    }

}
