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
import {MessageService} from '@services/message-service';
import {SendSmsHtmlRenderer} from '@modules/sms/pages/send-sms/send-sms.html.renderer';
import {VARIABLE_MAPPED_EVENT_LIST} from '@modules/classes/constants';
import {InformationService} from '@services/modules/information/information.service';

import { MatDialog } from '@angular/material';

import { PurchaseSmsDialogComponent } from './components/purchase-sms-dialog/purchase-sms-dialog.component';
import { PurchaseSmsSelectComponent } from './components/purchase-sms-select/purchase-sms-select.component';

import { CommonFunctions } from '@classes/common-functions';
@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService, InformationService],
})
export class SendSmsComponent implements OnInit {
    user;

    commonFunction = CommonFunctions.getInstance();

    serviceAdapter: SendSmsServiceAdapter;
    htmlRenderer: SendSmsHtmlRenderer;

    NULL_CONSTANT = null;

    showFilters = false;
    includeSecondMobileNumber = false;
    invalidmobilenumber = false;

    displayStudentNumber = 0;

    sendToList = [{ id: 1, name: 'Students' }, { id: 2, name: 'Employees' }, { id: 3, name: 'Common' }];

    dataForMapping = {} as any;

    employeeList = [];
    populatedTemplateList = [];
    classSectionList = [];
    studentSectionList = [];
    smsPersonList = [];
    notificationPersonList = [];
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];

    messageService: any;


    SMS_TYPE_ID = 2;
    NOTIFICATION_TYPE_ID = 3;
    SMS_AND_NOTIFICATION_TYPE_ID = 4;

    rows;
    timeout: any;
    nameFilter = '';
    message = '';

    personTypeListIndexedWithSendToId = ['student', 'employee', 'commonPerson'];

    stateKeeper = {
        isLoading: false
    };

    userInput = {
        selectedSendTo: null,
        selectedTemplate: {} as any,
        selectedSendUpdateType: {} as any,
        scheduleSMS: false,
        scheduledDate: null,
        scheduledTime: null,
    };

    backendData = {
        templateList: [],
        smsIdList: [],
        smsIdSchool: [],
        eventSettingList: [],
        studentList: [],
        classList: [],
        sectionList: [],
        sendUpdateTypeList: [],
        generalSMSEventList: [],
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
            no: false
        }
    };
    purchase: any;


    constructor(public studentService: StudentService,
        public employeeService: EmployeeService,
        public classService: ClassService,
        public smsOldService: SmsOldService,
        public smsService: SmsService,
        public notificationService: NotificationService,
        public informationService: InformationService,
        public userService: UserService,
        public cdRef: ChangeDetectorRef,
        public dialog: MatDialog) { }

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

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new SendSmsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.htmlRenderer = new SendSmsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

    }

    getMobileNumberList(returnType: string): any {
        let tempList = [];
        let variableList = VARIABLE_MAPPED_EVENT_LIST.find(vme => vme.eventId == this.userInput.selectedSendTo.id).variableList;
        this.dataForMapping['studentList'] = this.getFilteredStudentList().filter((x) => {
            return x.selected;
        }).map(a => a.student);
        this.dataForMapping['employeeList'] = this.employeeList.filter(x => x.selected);
        this.dataForMapping['commonPersonList'] = this.dataForMapping['studentList'].concat(this.dataForMapping['employeeList']);
        let personType = this.personTypeListIndexedWithSendToId[this.userInput.selectedSendTo.id - 1];
        this.dataForMapping[personType + 'List'].forEach(person => {
            if (!this.messageService.checkForDuplicate(variableList, tempList, this.dataForMapping,
                person, this.message, personType)) {
                person[personType] = true; // to identify which person in list eg: x['student'] = true
                tempList.push(person);
            }
            if (this.userInput.selectedSendTo.id == 1 ||  this.userInput.selectedSendTo.id == 3) {
                if (this.includeSecondMobileNumber && this.isMobileNumberValid(person.secondMobileNumber)) {
                    if (!this.messageService.checkForDuplicate(variableList, tempList, this.dataForMapping,
                        person, this.message, person, true)) {
                        person[personType] = true;
                        let personWithoutReference = JSON.parse(JSON.stringify(person));
                        personWithoutReference.mobileNumber = person.secondMobileNumber;
                        personWithoutReference['isSecondNumber'] = true; // mentioning the element is secondNumber entry
                        tempList.push(personWithoutReference);
                    }
                }
            }
        });

        if (this.userInput.selectedSendUpdateType.id == this.SMS_TYPE_ID) {
            this.smsPersonList = tempList;
            this.notificationPersonList = [];
        } else if (this.userInput.selectedSendUpdateType.id == this.NOTIFICATION_TYPE_ID) {
            this.smsPersonList = [];
            this.notificationPersonList = tempList.filter((temp) => {
                return (!temp.isSecondNumber && temp.notification) || (this.includeSecondMobileNumber && temp.isSecondNumber && temp.secondNumberNotification);
            });
        } else if (this.userInput.selectedSendUpdateType.id == this.SMS_AND_NOTIFICATION_TYPE_ID) {
            this.notificationPersonList = tempList.filter((temp) => {
                return (!temp.isSecondNumber && temp.notification) || (this.includeSecondMobileNumber && temp.isSecondNumber && temp.secondNumberNotification);
            });
            this.smsPersonList = tempList.filter((temp1) => {
                return (
                    this.notificationPersonList.find((temp2) => {
                        return temp1.mobileNumber == temp2.mobileNumber;
                    }) == undefined
                );
            });
        } else {
            console.error("error Selected Send Update Type");
            // alert('Error');
        }
        if (returnType == 'sms') {
            return this.smsPersonList;
        } else if (returnType == 'notification') {
            return this.notificationPersonList;
        } else if (returnType == 'both') {
            return this.smsPersonList.concat(this.notificationPersonList);
        } else {
            console.error("error in return Type");
            return null;
        }
    }

    hasUnicode(message): boolean {
        for (let i = 0; i < this.message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
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
                )
                    return true;
                // If something is checked
                if (this.studentFilters.category.general && studentSection.student.newCategoryField === 'Gen.') return true;
                if (this.studentFilters.category.sc && studentSection.student.newCategoryField === 'SC') return true;
                if (this.studentFilters.category.st && studentSection.student.newCategoryField === 'ST') return true;
                if (this.studentFilters.category.obc && studentSection.student.newCategoryField === 'OBC') return true;
                // For all other cases
                return false;
            })
            .filter((studentSection) => {
                // gender filter
                // if none selected return all
                if (!this.studentFilters.gender.male && !this.studentFilters.gender.female && !this.studentFilters.gender.other)
                    return true;
                // If something is checked
                if (this.studentFilters.gender.male && studentSection.student.gender == 'Male') return true;
                if (this.studentFilters.gender.female && studentSection.student.gender == 'Female') return true;
                if (this.studentFilters.gender.other && studentSection.student.gender == 'Other') return true;
                // For all other cases
                return false;
            })
            .filter((studentSection) => {
                if (!this.studentFilters.admission.new && !this.studentFilters.admission.old) return true;
                // admission new or old
                if (
                    studentSection.student.admissionSession === this.user.activeSchool.currentSessionDbId &&
                    this.studentFilters.admission.new
                )
                    return true;
                if (
                    studentSection.student.admissionSession !== this.user.activeSchool.currentSessionDbId &&
                    this.studentFilters.admission.old
                )
                    return true;
                return false;
            })
            .filter((studentSection) => {
                if (!this.studentFilters.rte.yes && !this.studentFilters.rte.no) return true;
                // rte yes or no
                if (studentSection.student.rte === 'YES' && this.studentFilters.rte.yes) return true;
                if (studentSection.student.rte === 'NO' && this.studentFilters.rte.no) return true;
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

    getClassSectionName(classId: number, sectionId: number): string {
        let classSection = this.classSectionList.find((classSection) => {
            return classSection.class.id == classId && classSection.section.id == sectionId;
        });
        let multipleSections =
            this.classSectionList.filter((classSection) => {
                return classSection.class.id == classId;
            }).length > 1;
        return classSection.class.name + (multipleSections ? ', ' + classSection.section.name : '');
    }

    hasPurchaseSMSPermission(): boolean {
        let moduleIdx = this.user.activeSchool.moduleList.findIndex(module => module.path === 'sms');
        let taskIdx = -1;
        taskIdx = this.user.activeSchool.moduleList[moduleIdx].taskList.findIndex(task => task.path === 'purchase_sms');
        if (taskIdx === -1)
            return false;

        return true;
    }

    openPurchaseSMSDialog(): void {
        if (DataStorage.getInstance().isFeatureEnabled("Easebuzz Online Payment Gateway Feature Flag")) {
            this.dialog.open(PurchaseSmsSelectComponent, {
                data: {
                    vm: this,
                }
            });
        } else {
            this.dialog.open(PurchaseSmsDialogComponent, {
                data: {
                    vm: this,
                }
            });
        }
    }

}
