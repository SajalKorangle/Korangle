import {ChangeDetectorRef, Component, ViewChild, OnInit} from '@angular/core';
import {ViewDefaultersServiceAdapter} from './view-defaulters.service.adapter';
import {FeeService} from '../../../../services/modules/fees/fee.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import {ClassService} from '../../../../services/modules/class/class.service';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {UserService} from '../../../../services/modules/user/user.service';
import {INSTALLMENT_LIST} from '../../classes/constants';
import {ExcelService} from '../../../../excel/excel-service';
import {DataStorage} from '../../../../classes/data-storage';
import {SchoolService} from '../../../../services/modules/school/school.service';
import {PrintService} from '../../../../print/print-service';
import {PRINT_FEES_REPORT} from '../../print/print-routes.constants';
import {ViewDefaultersHtmlRenderer} from '@modules/fees/pages/view-defaulters/view-defaulters.html.renderer';
import {MessageService} from '@services/message-service';
import {VARIABLE_MAPPED_EVENT_LIST} from '@modules/classes/constants';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FeeType } from '@services/modules/fees/models/fee-type';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material';
import {InformationService} from '@services/modules/information/information.service';

@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [FeeService, StudentService, ClassService, NotificationService, UserService, SmsService, SmsOldService, SchoolService, InformationService],
    //animation for row expansion on clicking row on mat table
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class ViewDefaultersComponent implements OnInit {
    studentDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

    paginator: MatPaginator;
    @ViewChild(MatPaginator, { static: false })
    set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.studentDataSource.paginator = this.paginator;
    }
    feeTypeList: FeeType[];
    studentFeeDetailsVisibleList = [];
    lateFeeVisible = true;
    sessionListWithDues = [];

    installmentList = INSTALLMENT_LIST;

    NULL_CONSTANT = null;

    showCustomFilters = false;

    showSMSSection = false;

    sessionList = [];

    STUDENT_LIMITER = 200;
    NOTIFY_DEFAULTERS_EVENT_DBID = 4;

    nullValue = null;

    user;

    defaultersPageVariables = VARIABLE_MAPPED_EVENT_LIST.find(x => x.eventId == this.NOTIFY_DEFAULTERS_EVENT_DBID).variableList;

    smsBalance = 0;

    subFeeReceiptList: any;
    subDiscountList: any;
    studentFeeList: any;
    studentSectionList: any;
    studentList: any;
    classList: any;
    sectionList: any;

    studentParameterList: any;
    studentParameterValueList: any;

    parentList = [];

    filterTypeList = ['Student', 'Parent'];

    selectedFilterType = this.filterTypeList[0];

    messageService: any;

    installmentNumber = 0;

    maximumNumber = null;
    minimumNumber = null;

    selectedClassSectionList = null;
    selectAllClassSection = true;
    filteredClassSectionList = [];
    dataForMapping =  {} as any;

    SEND_UPDATE_SMS_TYPE_DBID = 2;
    SEND_UPDATE_NOTIFICATION_TYPE_DBID = 3;
    SEND_UPDATE_SMS_AND_NOTIFICATION_TYPE_DBID = 4;

    message = '';

    userInput = {
        selectedTemplate: {} as any,
        selectedSendUpdateType: {} as any,
        scheduleSMS: false,
        scheduledDate: null,
        scheduledTime: null,
    };

    backendData = {
        smsIdList: [],
        templateList: [],
        eventSettingsList: [],
        smsIdSchoolList: [],
        sendUpdateTypeList: [],
        defaultersSMSEvent: {} as any
    };

    populatedTemplateList = [];

    serviceAdapter: ViewDefaultersServiceAdapter;
    htmlRenderer: ViewDefaultersHtmlRenderer;

    currentSession: any;

    isLoading = false;


    columnsToDisplay = ['select', 's.no', 'name', 'fathersName', 'class.name', 'section.name', 'mobileNumber', 'secondMobileNumber', 'feesDueTillMonth', `feesDueOverall`];

    feesDueBySession = [];

    constructor(
        public schoolService: SchoolService,
        public feeService: FeeService,
        public studentService: StudentService,
        public classService: ClassService,
        private excelService: ExcelService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
        public informationService: InformationService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new ViewDefaultersServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ViewDefaultersHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        const monthNumber = new Date().getMonth();
        this.installmentNumber = monthNumber > 2 ? monthNumber - 3 : monthNumber + 9;
        this.toggleAllSelection();
    }
    applyFilters() {
        // remove select all check if total length is less than total class section
        if (this.selectedClassSectionList.length < this.filteredClassSectionList.length) {
            this.selectAllClassSection = false;
        } else if (this.selectedClassSectionList.length == this.filteredClassSectionList.length) {
            this.selectAllClassSection = true;
        }

        this.studentDataSource.data = this.getFilteredStudentList();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    checkMobileNumber(mobileNumber: number): boolean {
        if (mobileNumber && mobileNumber.toString().length == 10) {
            return true;
        }
        return false;
    }

    handleLoading(): void {
        this.studentList.forEach((student) => {
            let filteredStudentFeeList = this.studentFeeList.filter((studentFee) => {
                return studentFee.parentStudent == student.id;
            });

            let filteredSubFeeReceiptList = this.subFeeReceiptList.filter((subFeeReceipt) => {
                return (
                    filteredStudentFeeList.find((studentFee) => {
                        return studentFee.id == subFeeReceipt.parentStudentFee;
                    }) != undefined
                );
            });

            let filteredSubDiscountList = this.subDiscountList.filter((subDiscount) => {
                return (
                    filteredStudentFeeList.find((studentFee) => {
                        return studentFee.id == subDiscount.parentStudentFee;
                    }) != undefined
                );
            });

            student['feesDueTillMonth'] =
                filteredStudentFeeList.reduce((total, studentFee) => {
                    let filteredInstallmentList = [];
                    if (studentFee.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }

                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                    let filteredInstallmentList = [];
                    if (subFeeReceipt.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubDiscountList.reduce((total, subDiscount) => {
                    let filteredInstallmentList = [];
                    if (subDiscount.parentSession == this.currentSession.id) {
                        filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    } else {
                        filteredInstallmentList = this.installmentList;
                    }
                    return (
                        total +
                        filteredInstallmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['feesDueOverall'] =
                filteredStudentFeeList.reduce((total, studentFee) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }
                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0) -
                filteredSubDiscountList.reduce((total, subDiscount) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['feesPaidThisSession'] = filteredSubFeeReceiptList
                .filter((subFeeReceipt) => {
                    return subFeeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, subFeeReceipt) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                                (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['discountThisSession'] = filteredSubDiscountList
                .filter((subDiscount) => {
                    return subDiscount.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, subDiscount) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            return (
                                installmentAmount +
                                (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0) +
                                (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0)
                            );
                        }, 0)
                    );
                }, 0);

            student['totalFeesThisSession'] = filteredStudentFeeList
                .filter((studentFee) => {
                    return studentFee.parentSession == this.user.activeSchool.currentSessionDbId;
                })
                .reduce((total, studentFee) => {
                    return (
                        total +
                        this.installmentList.reduce((installmentAmount, installment) => {
                            let lateFeeAmount = 0;
                            if (
                                studentFee[installment + 'LastDate'] &&
                                studentFee[installment + 'LateFee'] &&
                                studentFee[installment + 'LateFee'] > 0
                            ) {
                                let lastDate = new Date(studentFee[installment + 'LastDate']);
                                let clearanceDate = new Date();
                                if (studentFee[installment + 'ClearanceDate']) {
                                    clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                                }
                                let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (numberOfLateDays > 0) {
                                    lateFeeAmount =
                                        (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                    if (
                                        studentFee[installment + 'MaximumLateFee'] &&
                                        studentFee[installment + 'MaximumLateFee'] < lateFeeAmount
                                    ) {
                                        lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                    }
                                }
                            }
                            return (
                                installmentAmount +
                                (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0) +
                                lateFeeAmount
                            );
                        }, 0)
                    );
                }, 0);

            let studentSection = this.studentSectionList.find((studentSection) => {
                return (
                    studentSection.parentStudent == student.id && studentSection.parentSession == this.user.activeSchool.currentSessionDbId
                );
            });

            student['rollNumber'] = studentSection.rollNumber;

            student['class'] = this.classList.find((classs) => {
                return studentSection.parentClass == classs.id;
            });

            student['section'] = this.sectionList.find((section) => {
                return studentSection.parentDivision == section.id;
            });

            this.checkAndAddToFilteredClassSectionList(student['class'], student['section']);

            let parentObject = this.parentList.find((parent) => {
                return parent.mobileNumber == student.mobileNumber && parent.mobileNumber != null;
            });

            if (parentObject) {
                parentObject['studentList'].push(student);
            } else {
                let newParentObject = {
                    name: student.fathersName,
                    mobileNumber: student.mobileNumber,
                    studentList: [student],
                    notification: student.notification,
                };
                this.parentList.push(newParentObject);
            }
        });

        this.parentList = this.parentList.sort((a, b) => {
            let amount = this.getParentFeesDueTillMonth(b) - this.getParentFeesDueTillMonth(a);
            if (amount != 0) {
                return amount;
            }
            amount = this.getParentFeesDueOverall(b) - this.getParentFeesDueOverall(a);
            if (amount != 0) {
                return amount;
            }
            amount = this.getParentFeesPaid(a) - this.getParentFeesPaid(b);
            if (amount != 0) {
                return amount;
            }
            return this.getParentTotalFees(b) - this.getParentTotalFees(a);
        });

        this.studentList = this.studentList.sort((a, b) => {
            let amount = b.feesDueTillMonth - a.feesDueTillMonth;
            if (amount != 0) {
                return amount;
            }
            amount = b.feesDueOverall - a.feesDueOverall;
            if (amount != 0) {
                return amount;
            }
            amount = a.feesPaidThisSession - b.feesPaidThisSession;
            if (amount != 0) {
                return amount;
            }
            return b.totalFeesThisSession - a.totalFeesThisSession;
        });
        this.studentList.forEach((student, index) => {
            student['position'] = index + 1;
        });

        this.filteredClassSectionList = this.filteredClassSectionList.sort((a, b) => {
            let orderNumber = a.class.orderNumber - b.class.orderNumber;
            if (orderNumber != 0) {
                return orderNumber;
            }
            return a.section.orderNumber - b.section.orderNumber;
        });
        this.sessionListWithDues = this.getSessionsWithDue();
        this.sessionListWithDues.forEach(session => {
            this.columnsToDisplay.push(session.name);
        });
        let tempArr = [`totalFeesThisSession`, `feesPaidThisSession`, 'discountThisSession'];
        this.columnsToDisplay.push(...tempArr);
        this.studentDataSource = new MatTableDataSource(this.studentList);
    }

    checkAndAddToFilteredClassSectionList(classs: any, section: any): void {
        if (
            this.filteredClassSectionList.find((classSection) => {
                return classSection.class.id === classs.id && classSection.section.id === section.id;
            }) == undefined
        ) {
            this.filteredClassSectionList.push({
                class: classs,
                section: section,
            });
        }
    }

    toggleAllSelection() {
        if (this.selectAllClassSection) {
            this.selectedClassSectionList = this.filteredClassSectionList;
        } else {
            this.selectedClassSectionList = [];
        }
        this.applyFilters();
    }

    hasUnicode(message): boolean {
        for (let i = 0; i < message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)) {
            return Math.ceil(message.length / 70);
        } else {
            return Math.ceil(message.length / 160);
        }
    }

    getParameterValue = (student, parameter) => {
        try {
            return this.studentParameterValueList.find((x) => x.parentStudent === student.id && x.parentStudentParameter === parameter.id)
                .value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getFilteredStudentList(): any {
        let tempList = this.studentList.filter((student) => {
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
            return true;
        });
        if (this.selectedClassSectionList) {

            tempList = tempList.filter((student) => {
                return this.selectedClassSectionList.find((classSection) => {
                    return (
                        student.class.id == classSection.class.id &&
                        student.section.id == classSection.section.id
                    );
                }
                );
            });

        }
        if ((this.maximumNumber && this.maximumNumber != '') || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter((student) => {
                let amount = student.feesDueTillMonth;
                return (
                    (this.maximumNumber && this.maximumNumber != '' ? amount <= this.maximumNumber : true) &&
                    (this.minimumNumber && this.minimumNumber != '' ? amount >= this.minimumNumber : true)
                );
            });
        }
        return tempList;
    }

    getCurrentSessionName() {
        return this.sessionList.find((session) => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        }).name;
    }

    getFilteredParentList(): any {
        let tempList = this.parentList;
        if ((this.maximumNumber && this.maximumNumber != '') || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter((parent) => {
                let amount = parent.studentList.reduce((amount, student) => {
                    return amount + student['feesDueTillMonth'];
                }, 0);
                return (
                    (this.maximumNumber && this.maximumNumber != '' ? amount <= this.maximumNumber : true) &&
                    (this.minimumNumber && this.minimumNumber != '' ? amount >= this.minimumNumber : true)
                );
            });
        }
        return tempList;
    }

    getParentFeesDueTillMonth(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getParentTotalFees(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    getParentFeesDueOverall(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueOverall'];
        }, 0);
    }

    getParentFeesPaid(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesPaidThisSession'];
        }, 0);
    }

    getParentDiscount(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['discountThisSession'];
        }, 0);
    }

    printFeesReport(): any {
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.printStudentFeesReport();
        } else {
            this.printParentFeesReport();
        }
    }

    printStudentFeesReport(): void {
        let tempArray = ['S No.', 'Name', 'Scholar Number', 'Roll Number', "Father's Name", 'Class and Sections', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)', 'Fees Due (overall)'];
        this.sessionListWithDues.forEach(session => {
            tempArray.push("Fees Due (" + session.name + ")");
        });
        tempArray.push(`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})`);
        let template: any;
        template = [tempArray];
        let count = 0;
        this.getFilteredStudentList().forEach((student) => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.scholarNumber);
            row.push(student.rollNumber);
            row.push(student.fathersName);
            row.push(student.class.name + ', ' + student.section.name);
            row.push(this.checkMobileNumber(student.mobileNumber) ? student.mobileNumber : '');
            row.push(this.checkMobileNumber(student.secondMobileNumber) ? student.secondMobileNumber : '');
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            this.sessionListWithDues.forEach(session => {
                row.push(this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session));
            });
            row.push(student.totalFeesThisSession);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            template.push(row);
            // console.log(student.feesDueTillMonth);
        });
        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, { user: this.user, template: template });
    }

    printParentFeesReport(): void {
        let tempArray = ['S No.', 'Parent', 'Student', 'Scholar Number', 'Roll Number', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)', 'Fees Due (overall)'];
        this.sessionListWithDues.forEach(session => {
            tempArray.push("Fees Due (" + session.name + ")");
        });
        tempArray.push(`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`);
        let template: any;

        template = [tempArray];
        let count = 0;
        this.getFilteredParentList().forEach((parent) => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].scholarNumber);
                row.push(parent.studentList[0].rollNumber);
                row.push(parent.studentList[0].class.name + ', ' + parent.studentList[0].section.name);
                row.push(this.checkMobileNumber(parent.studentList[0].mobileNumber) ? parent.studentList[0].mobileNumber : '');
                row.push(this.checkMobileNumber(parent.studentList[0].secondMobileNumber) ? parent.studentList[0].secondMobileNumber : '');
            } else {
                row.push('');
                row.push('');
                row.push('');
                row.push('');
                row.push(this.checkMobileNumber(parent.studentList[0].mobileNumber) ? parent.studentList[0].mobileNumber : '');
                row.push('');
            }
            row.push(this.getParentFeesDueTillMonth(parent));
            row.push(this.getParentFeesDueOverall(parent));
            this.sessionListWithDues.forEach(session => {
                row.push(this.getParentFeesDueBySession(parent, session));
            });
            row.push(this.getParentTotalFees(parent));
            row.push(this.getParentFeesPaid(parent));
            row.push(this.getParentDiscount(parent));
            template.push(row);
            if (parent.studentList.length > 1) {
                parent.studentList.forEach((student) => {
                    let newRow = [];
                    newRow.push('');
                    newRow.push('');
                    newRow.push(student.name);
                    newRow.push(student.scholarNumber);
                    newRow.push(student.rollNumber);
                    newRow.push(student.class.name + ', ' + student.section.name);
                    newRow.push('');
                    newRow.push(this.checkMobileNumber(student.secondMobileNumber) ? student.secondMobileNumber : '');
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
                    this.sessionListWithDues.forEach(session => {
                        newRow.push(this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session));
                    });
                    newRow.push(student.totalFeesThisSession);
                    newRow.push(student.feesPaidThisSession);
                    newRow.push(student.discountThisSession);
                    template.push(newRow);
                });
            }
        });

        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, { user: this.user, template: template });
    }

    downloadStudentFeesReport(): void {
        let tempArray = ['S No.', 'Name', 'Scholar Number', 'Roll Number', "Father's Name", 'Class and Section', 'Mobile No.', 'Mobile No. (2)', 'Address', 'Fees Due (till month)', 'Fees Due (overall)'];
        this.sessionListWithDues.forEach(session => {
            tempArray.push("Fees Due (" + session.name + ")");
        });
        tempArray.push(`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})`);
        let template: any;
        template = [tempArray];

        let count = 0;
        this.getFilteredStudentList().forEach((student) => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.scholarNumber);
            row.push(student.rollNumber);
            row.push(student.fathersName);
            row.push(student.class.name + ', ' + student.section.name);
            row.push(student.mobileNumber);
            row.push(student.secondMobileNumber);
            row.push(student.address);
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            this.sessionListWithDues.forEach(session => {
                row.push(this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session));
            });
            row.push(student.totalFeesThisSession);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            template.push(row);
        });

        this.excelService.downloadFile(template, 'korangle_student_fees.csv');
    }

    downloadParentFeesReport(): void {
        let tempArray = ['S No.', 'Parent', 'Student', 'Scholar Number', 'Roll Number', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Address', 'Fees Due (till month)', 'Fees Due (overall)'];
        this.sessionListWithDues.forEach(session => {
            tempArray.push("Fees Due (" + session.name + ")");
        });
        tempArray.push(`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`);

        let template: any;

        template = [tempArray];

        let count = 0;
        this.getFilteredParentList().forEach((parent) => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].scholarNumber);
                row.push(parent.studentList[0].rollNumber);
                row.push(parent.studentList[0].class.name + ', ' + parent.studentList[0].section.name);
                row.push(parent.studentList[0].mobileNumber);
                row.push(parent.studentList[0].secondMobileNumber);
                row.push(parent.studentList[0].address);
            } else {
                row.push('');
                row.push('');
                row.push('');
                row.push('');
                row.push(parent.studentList[0].mobileNumber);
                row.push('');
                row.push('');
            }
            row.push(this.getParentFeesDueTillMonth(parent));
            row.push(this.getParentFeesDueOverall(parent));
            this.sessionListWithDues.forEach(session => {
                row.push(this.getParentFeesDueBySession(parent, session));
            });
            row.push(this.getParentTotalFees(parent));
            row.push(this.getParentFeesPaid(parent));
            row.push(this.getParentDiscount(parent));
            template.push(row);
            if (parent.studentList.length > 1) {
                parent.studentList.forEach((student) => {
                    let newRow = [];
                    newRow.push('');
                    newRow.push('');
                    newRow.push(student.name);
                    newRow.push(student.scholarNumber);
                    newRow.push(student.rollNumber);
                    newRow.push(student.class.name + ', ' + student.section.name);
                    newRow.push('');
                    newRow.push(student.secondMobileNumber);
                    newRow.push(student.address);
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
                    this.sessionListWithDues.forEach(session => {
                        newRow.push(this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session));
                    });
                    newRow.push(student.totalFeesThisSession);
                    newRow.push(student.feesPaidThisSession);
                    newRow.push(student.discountThisSession);
                    template.push(newRow);
                });
            }
        });

        this.excelService.downloadFile(template, 'korangle_parent_fees.csv');
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        let studentList = [];
        if (this.userInput.selectedSendUpdateType.id == this.SEND_UPDATE_SMS_TYPE_DBID) {
            return 0;
        }
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).forEach(student => {
                if (!this.messageService.checkForDuplicate(this.defaultersPageVariables,
                    studentList, this.dataForMapping, student, this.message, 'student')) {
                    count++;
                    studentList.push(student);
                }
            });
        } else {
            this.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).forEach(parent => {
                parent.studentList.forEach(student => {
                    if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList,
                        this.dataForMapping, student, this.message, 'student')) {
                        count++;
                        studentList.push(student);
                    }
                });
            });
        }
        return count;
    }

    getEstimatedSMSCount = () => {
        let count = 0;
        let studentList = [];
        if (this.userInput.selectedSendUpdateType.id == this.SEND_UPDATE_NOTIFICATION_TYPE_DBID) {
            return 0;
        }
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.dataForMapping['studentList'] = this.getFilteredStudentList().filter((item) => item.mobileNumber && item.selected);
            this.getFilteredStudentList()
                .filter((item) => item.mobileNumber && item.selected)
                .forEach((item, i) => {
                    if (this.userInput.selectedSendUpdateType.id == this.SEND_UPDATE_SMS_TYPE_DBID || item.notification == false) {
                        if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList,
                            this.dataForMapping, item, this.message, 'student'))
                        {
                            count += this.getMessageCount(
                                this.messageService.getMessageFromTemplate(this.message,
                                    this.messageService.getMappingData(this.defaultersPageVariables, this.dataForMapping, 'student', item))
                            );
                            studentList.push(item);
                        }
                    }
                });
        } else {
            this.getFilteredParentList()
                .filter((item) => item.mobileNumber && item.selected)
                .forEach((item, i) => {
                    if (this.userInput.selectedSendUpdateType.id == this.SEND_UPDATE_SMS_TYPE_DBID || item.notification == false) {
                        this.dataForMapping['studentList'] = item.studentList;
                        item.studentList.forEach(student => {
                        if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList, this.dataForMapping, student, this.message, 'student'))
                        {
                            count += this.getMessageCount(
                                this.messageService.getMessageFromTemplate(this.message,
                                    this.messageService.getMappingData(this.defaultersPageVariables, this.dataForMapping, 'student', student))
                            );
                            studentList.push(student);
                        }
                        });
                    }
                });
        }
        return count;
    }
 showOrHideStudentFeeDetails(studentFee: any): void {
        if (
            this.studentFeeDetailsVisibleList.find((item) => {
                return item == studentFee.id;
            })
        ) {
            this.studentFeeDetailsVisibleList = this.studentFeeDetailsVisibleList.filter((item) => {
                return item != studentFee.id;
            });
        } else {
            this.studentFeeDetailsVisibleList.push(studentFee.id);
        }
    }
    getFilteredInstallmentListByStudentFee(studentFee: any): any {
        return this.installmentList.filter((installment) => {
            return studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] > 0 : false;
        });
    }
    studentFeeDetailsVisible(studentFee: any): boolean {
        return (
            this.studentFeeDetailsVisibleList.find((item) => {
                return item == studentFee.id;
            }) != undefined
        );
    }
    getParentFeesDueBySession(parent: any, session: any) {
        let amount = 0;
        parent.studentList.forEach(student => {
            amount += this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session);
        });
        return amount;
    }
    getFilteredStudentListFeesDueBySession(session: any): any {
        let amount = 0;
        this.getFilteredStudentList().forEach(student => {
            amount += this.getSessionFeesDue(student.id, session) + this.getSessionLateFeesDue(student.id, session);
        });
        return amount;
    }
    getSessionsWithDue(): any {
        return this.sessionList.filter(session => {
            return this.getFilteredStudentListFeesDueBySession(session) > 0;
        });
    }
    getSessionsWithDueByStudentId(id: any): any {
        return this.sessionList.filter(session => {
            return this.getSessionFeesDue(id, session) + this.getSessionLateFeesDue(id, session) > 0;
        });
    }
    getStudentFeeByStudentId(id: any): any {
        return this.studentFeeList.filter((studentFee) => {
            return studentFee.parentStudent == id && this.getStudentFeeTotalFees(studentFee) > 0;
        });
    }
    getStudentFeeByStudentIdAndSession(id: any, session: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        return studentFeeList.filter((studentFee) => {
            return studentFee.parentSession == session.id;
        });
    }
    getFeeTypeByStudentFee(studentFee: any): any {
        return this.feeTypeList.find((feeType) => {
            return feeType.id == studentFee.parentFeeType;
        });
    }
    getTotalLateFees(id: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let amount = 0;
        studentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
            });
        });
        return amount;
    }
    getTotalLateFeesDue(id: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let amount = 0;
        studentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
            });
        });
        return amount;
    }
    getAllSessionsFeesDueByStudentId(id: any): any {
        let amount = 0;
        this.getSessionsWithDueByStudentId(id).forEach(session => {
            amount += this.getSessionFeesDue(id, session);
        });
        return amount;
    }
    getAllSessionsTotalFeesByStudentId(id: any): any {
        let amount = 0;
        this.getSessionsWithDueByStudentId(id).forEach(session => {
            amount += this.getSessionTotalFees(id, session);
        });
        return amount;
    }
    getSessionFeesDue(id: any, session: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList = studentFeeList.filter((studentFee) => {
            return studentFee.parentSession == session.id;
        });
        let amount = 0;
        filteredStudentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
            });
        });
        return amount;
    }
    getSessionTotalFees(id: any, session: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList = studentFeeList.filter((studentFee) => {
            return studentFee.parentSession == session.id;
        });
        let amount = 0;
        filteredStudentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += studentFee[installment + "Amount"];
            });
        });
        return amount;
    }
    getSessionLateFeesDue(id: any, session: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList = studentFeeList.filter((studentFee) => {
            return studentFee.parentSession == session.id;
        });
        let amount = 0;
        filteredStudentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
            });
        });
        return amount;
    }
    getSessionLateFeeTotal(id: any, session: any): any {
        let studentFeeList = this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList = studentFeeList.filter((studentFee) => {
            return studentFee.parentSession == session.id;
        });
        let amount = 0;
        filteredStudentFeeList.forEach((studentFee) => {
            this.installmentList.forEach((installment) => {
                amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
            });
        });
        return amount;
    }
    getStudentFeeFeesDue(studentFee: any): number {
        let amount = 0;
        this.installmentList.forEach((installment) => {
            amount += this.getStudentFeeInstallmentFeesDue(studentFee, installment);
        });
        return amount;


    }
    getStudentFeeLateFeesDue(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
        });
        return amount;
    }
    getStudentFeeLateFeeTotal(studentFee: any): number {
        let amount = 0;
        this.getFilteredInstallmentListByStudentFee(studentFee).forEach((installment) => {
            amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        });
        return amount;
    }
    getStudentFeeTotalFees(studentFee: any): number {
        let amount = 0;
        this.installmentList.forEach((installment) => {
            amount += this.getStudentFeeInstallmentTotalFees(studentFee, installment);
        });
        return amount;
    }
    getStudentFeeInstallmentTotalFees(studentFee: any, installment: string): number {
        let amount = 0;
        amount += studentFee[installment + 'Amount'];
        return amount;
    }

    getStudentFeeInstallmentLateFeeTotal(studentFee: any, installment: string): number {
        let amount = 0;
        if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
            let lastDate = new Date(studentFee[installment + 'LastDate']);
            let clearanceDate = new Date();
            if (studentFee[installment + 'ClearanceDate']) {
                clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
            }
            let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (numberOfLateDays > 0) {
                amount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < amount) {
                    amount = studentFee[installment + 'MaximumLateFee'];
                }
            }
        }
        return amount;
    }
    getStudentFeeInstallmentFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
        amount += studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0;
        filteredSubReceiptList.forEach((subFeeReceipt) => {
            if (subFeeReceipt[installment + 'Amount']) {
                amount -= subFeeReceipt[installment + 'Amount'];
            }
        });
        filteredSubDiscountList.forEach((subDiscount) => {
            if (subDiscount[installment + 'Amount']) {
                amount -= subDiscount[installment + 'Amount'];
            }
        });
        return amount;
    }

    getStudentFeeInstallmentLateFeesDue(studentFee: any, installment: string): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee);
        let filteredSubDiscountList = this.getFilteredSubDiscountListByStudentFee(studentFee);
        amount += this.getStudentFeeInstallmentLateFeeTotal(studentFee, installment);
        filteredSubReceiptList.forEach((subFeeReceipt) => {
            if (subFeeReceipt[installment + 'LateFee']) {
                amount -= subFeeReceipt[installment + 'LateFee'];
            }
        });
        filteredSubDiscountList.forEach((subDiscount) => {
            if (subDiscount[installment + 'LateFee']) {
                amount -= subDiscount[installment + 'LateFee'];
            }
        });
        return amount;
    }
    getFilteredSubFeeReceiptListByStudentFee(studentFee: any): any {
        let filteredSubFeeReceiptList = this.subFeeReceiptList.filter((subFeeReceipt) => {
            return (
                subFeeReceipt.parentStudentFee == studentFee.id
            );
        });
        return filteredSubFeeReceiptList;
    }
    getFilteredSubDiscountListByStudentFee(studentFee: any): any {
        let filteredSubDiscountList = this.subDiscountList.filter((subDiscount) => {
            return (
                subDiscount.parentStudentFee == studentFee.id
            );
        });
        return filteredSubDiscountList;
    }
}
