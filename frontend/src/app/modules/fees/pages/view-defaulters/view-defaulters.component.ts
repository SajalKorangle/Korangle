import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
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
import {DEFAULTER_VARIABLES, SENT_UPDATE_TYPE} from '@modules/sms/classes/constants';

@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [FeeService, StudentService, ClassService, NotificationService, UserService, SmsService, SmsOldService, SchoolService],
})
export class ViewDefaultersComponent implements OnInit {
    installmentList = INSTALLMENT_LIST;

    NULL_CONSTANT = null;

    showCustomFilters = false;

    showSMSSection = false;

    sessionList = [];

    STUDENT_LIMITER = 200;

    nullValue = null;

    user;

    sentTypeList = SENT_UPDATE_TYPE.filter(type => type.name != 'NULL');
    defaultersPageVariables = DEFAULTER_VARIABLES;

    selectedSentType = this.sentTypeList[0];
    extraDefaulterMessage = '';

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

    selectedClassSection = null;
    filteredClassSectionList = [];
    dataForMapping =  {} as any;

    message = '';

    userInput = {
        selectedTemplate: {} as any,
    };

    backendData = {
        smsIdList: [],
        templateList: [],
        eventSettingsList: [],
        smsIdSchoolList: [],
        defaultersSMSEvent: [],
    };

    populatedTemplateList = [];
    variableRegex = /{#(.*?)#}/g;


    serviceAdapter: ViewDefaultersServiceAdapter;
    htmlRenderer: ViewDefaultersHtmlRenderer;

    currentSession: any;

    isLoading = false;

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
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {
    }

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

        this.filteredClassSectionList = this.filteredClassSectionList.sort((a, b) => {
            let orderNumber = a.class.orderNumber - b.class.orderNumber;
            if (orderNumber != 0) {
                return orderNumber;
            }
            return a.section.orderNumber - b.section.orderNumber;
        });
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
        if (this.selectedClassSection) {
            tempList = tempList.filter((student) => {
                return student.class.id == this.selectedClassSection.class.id && student.section.id == this.selectedClassSection.section.id;
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
        let template: any;
        template = [
            [
                'S No.',
                'Student',
                'Parent',
                'Class',
                'Mobile No.',
                'Mobile No. (2)',
                'Fees Due (till month)',
                'Fees Due (overall)',
                `Total Fees (${this.getCurrentSessionName()})`,
                `Fees Paid (${this.getCurrentSessionName()})`,
                `Discount (${this.getCurrentSessionName()})`,
            ],
        ];

        let count = 0;
        this.getFilteredStudentList().forEach((student) => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.fathersName);
            row.push(student.class.name + ', ' + student.section.name);
            row.push(this.checkMobileNumber(student.mobileNumber) ? student.mobileNumber : '');
            row.push(this.checkMobileNumber(student.secondMobileNumber) ? student.secondMobileNumber : '');
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            row.push(student.totalFeesThisSession);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            template.push(row);
        });
        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, {user: this.user, template: template});
    }

    printParentFeesReport(): void {
        let template: any;

        template = [
            [
                'S No.',
                'Parent',
                'Student',
                'Class',
                'Mobile No.',
                'Mobile No. (2)',
                'Fees Due (till month)',
                'Fees Due (overall)',
                `Total Fees (${this.getCurrentSessionName()})`,
                `Fees Paid (${this.getCurrentSessionName()})`,
                `Discount (${this.getCurrentSessionName()}))`,
            ],
        ];

        let count = 0;
        this.getFilteredParentList().forEach((parent) => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].class.name + ', ' + parent.studentList[0].section.name);
                row.push(this.checkMobileNumber(parent.studentList[0].mobileNumber) ? parent.studentList[0].mobileNumber : '');
                row.push(this.checkMobileNumber(parent.studentList[0].secondMobileNumber) ? parent.studentList[0].secondMobileNumber : '');
            } else {
                row.push('');
                row.push('');
                row.push(this.checkMobileNumber(parent.studentList[0].mobileNumber) ? parent.studentList[0].mobileNumber : '');
                row.push('');
            }
            row.push(this.getParentFeesDueTillMonth(parent));
            row.push(this.getParentFeesDueOverall(parent));
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
                    newRow.push(student.class.name + ', ' + student.section.name);
                    newRow.push('');
                    newRow.push(this.checkMobileNumber(student.secondMobileNumber) ? student.secondMobileNumber : '');
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
                    newRow.push(student.totalFeesThisSession);
                    newRow.push(student.feesPaidThisSession);
                    newRow.push(student.discountThisSession);
                    template.push(newRow);
                });
            }
        });

        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, {user: this.user, template: template});
    }

    downloadStudentFeesReport(): void {
        let template: any;
        template = [
            [
                'S No.',
                'Student',
                'Parent',
                'Class',
                'Mobile No.',
                'Mobile No. (2)',
                'Address',
                'Fees Due (till month)',
                'Fees Due (overall)',
                `Total Fees (${this.getCurrentSessionName()})`,
                `Fees Paid (${this.getCurrentSessionName()})`,
                `Discount (${this.getCurrentSessionName()})`,
            ],
        ];

        let count = 0;
        this.getFilteredStudentList().forEach((student) => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.fathersName);
            row.push(student.class.name + ', ' + student.section.name);
            row.push(student.mobileNumber);
            row.push(student.secondMobileNumber);
            row.push(student.address);
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            row.push(student.totalFeesThisSession);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            template.push(row);
        });

        this.excelService.downloadFile(template, 'korangle_student_fees.csv');
    }

    downloadParentFeesReport(): void {
        let template: any;

        template = [
            [
                'S No.',
                'Parent',
                'Student',
                'Class',
                'Mobile No.',
                'Mobile No. (2)',
                'Address',
                'Fees Due (till month)',
                'Fees Due (overall)',
                `Total Fees (${this.getCurrentSessionName()})`,
                `Fees Paid (${this.getCurrentSessionName()})`,
                `Discount (${this.getCurrentSessionName()}))`,
            ],
        ];

        let count = 0;
        this.getFilteredParentList().forEach((parent) => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].class.name + ', ' + parent.studentList[0].section.name);
                row.push(parent.studentList[0].mobileNumber);
                row.push(parent.studentList[0].secondMobileNumber);
                row.push(parent.studentList[0].address);
            } else {
                row.push('');
                row.push('');
                row.push(parent.studentList[0].mobileNumber);
                row.push('');
                row.push('');
            }
            row.push(this.getParentFeesDueTillMonth(parent));
            row.push(this.getParentFeesDueOverall(parent));
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
                    newRow.push(student.class.name + ', ' + student.section.name);
                    newRow.push('');
                    newRow.push(student.secondMobileNumber);
                    newRow.push(student.address);
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
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
        if (this.selectedSentType == this.sentTypeList[0]) {
            return 0;
        }
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).forEach(student => {
                if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList, this.dataForMapping, student.id, this.message)) {
                    count++;
                    studentList.push(student);
                }
            });
        } else {
            this.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).forEach(parent => {
                parent.studentList.forEach(student => {
                    if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList, this.dataForMapping, student.id, this.message)) {
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
        if (this.selectedSentType == this.sentTypeList[1]) {
            return 0;
        }
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.dataForMapping['studentList'] = this.getFilteredStudentList().filter((item) => item.mobileNumber && item.selected);
            this.getFilteredStudentList()
                .filter((item) => item.mobileNumber && item.selected)
                .forEach((item, i) => {
                    if (this.selectedSentType == this.sentTypeList[0] || item.notification == false) {
                        if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList, this.dataForMapping, item.id, this.message))
                        {
                            count += this.getMessageCount(
                                this.messageService.getMessageFromTemplate(this.message,
                                    this.messageService.getMappingData(this.defaultersPageVariables, this.dataForMapping, 'student', item.id))
                            );
                            studentList.push(item);
                        }
                    }
                });
        } else {
            this.getFilteredParentList()
                .filter((item) => item.mobileNumber && item.selected)
                .forEach((item, i) => {
                    if (this.selectedSentType == this.sentTypeList[0] || item.notification == false) {
                        this.dataForMapping['studentList'] = item.studentList;
                        item.studentList.forEach(student => {
                        if (!this.messageService.checkForDuplicate(this.defaultersPageVariables, studentList, this.dataForMapping, student.id, this.message))
                        {
                            count += this.getMessageCount(
                                this.messageService.getMessageFromTemplate(this.message,
                                    this.messageService.getMappingData(this.defaultersPageVariables, this.dataForMapping, 'student', student.id))
                            );
                            studentList.push(student);
                        }
                        });
                    }
                });
        }
        return count;
    }

    getCurrencyInINR = (data) => {
        return 'Rs. ' + Number(data).toLocaleString('en-IN');
    }

}
