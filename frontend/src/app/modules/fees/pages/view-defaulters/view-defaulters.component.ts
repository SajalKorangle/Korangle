import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ViewDefaultersServiceAdapter } from "./view-defaulters.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import { StudentService } from "../../../../services/modules/student/student.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { ClassService } from "../../../../services/modules/class/class.service";
import { NotificationService } from "../../../../services/modules/notification/notification.service";
import { UserService } from "../../../../services/modules/user/user.service";
import { INSTALLMENT_LIST } from "../../classes/constants";
import { ExcelService } from "../../../../excel/excel-service";
import { DataStorage } from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_FEES_REPORT } from '../../print/print-routes.constants';
import { isMobile } from '../../../../classes/common.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StudentFee } from '@services/modules/fees/models/student-fee';
import {FeeType} from '@services/modules/fees/models/fee-type';
import { SchoolFeeRule } from '../../../../services/modules/fees/models/school-fee-rule';
import { SubFeeReceipt } from '../../../../services/modules/fees/models/sub-fee-receipt';
import { SubDiscount } from '../../../../services/modules/fees/models/sub-discount';
import { FeeReceipt } from '../../../../services/modules/fees/models/fee-receipt';
import { Discount } from '../../../../services/modules/fees/models/discount';
import { MODE_OF_PAYMENT_LIST} from '../../classes/constants';


@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [FeeService, StudentService, ClassService, NotificationService, UserService, SmsService, SmsOldService, SchoolService],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})

export class ViewDefaultersComponent implements OnInit {

    myStudentFeeList:StudentFee[];
    myFeeTypeList:FeeType[];
    mySchoolFeeRuleList: SchoolFeeRule[];
    mySubFeeReceiptList:SubFeeReceipt[];
    mySubDiscountList:SubDiscount[];
    myFeeReceiptList: FeeReceipt[];
    myDiscountList: Discount[];
    newSubFeeReceiptList = [];
    newFeeReceiptList=[];
    newRemark = null;
    newModeOfPayment = MODE_OF_PAYMENT_LIST[0];



    installmentList = INSTALLMENT_LIST;

    NULL_CONSTANT = null;

    showCustomFilters = false;

    showSMSSection = false;

    sessionList = [];

    STUDENT_LIMITER = 200;

    nullValue = null;

    user;

    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    studentMessage = "Hi <fathersName>,\n<name>'s fees due till date is <feesDueTillMonth>";
    parentMessage = "Hi <name>,\nYour fees due till date is <feesDueTillMonth>\n<childrenData>";

    selectedSentType = 'SMS';
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

    notif_usernames = [];

    parentList = [];

    filterTypeList = [
        'Student',
        'Parent',
    ];

    selectedFilterType = this.filterTypeList[0];

    // d1 = new Date();
    // d2 = new Date();

    installmentNumber = 0;

    maximumNumber = null;
    minimumNumber = null;

    selectedClassSection = null;
    filteredClassSectionList = [];

    serviceAdapter: ViewDefaultersServiceAdapter;

    currentSession: any;

    isLoading = false;

    studentDataSource: any;
    parentDataSource: any;

    columnsToDisplay = ['select', 's.no', 'name', 'fathersName', 'class.name', 'section.name', 'mobileNumber', 'secondMobileNumber', 'feesDueTillMonth', `feesDueOverall`, `totalFeesThisSession`, `feesPaidThisSession`, 'discountThisSession'];
    columnsToDisplayParent = ['select', 'parent', 'student', 'class.name', 'mobileNumber', 'secondMobileNumber', 'feesDueTillMonth', `feesDueOverall`, `totalFeesThisSession`, `feesPaidThisSession`, 'discountThisSession'];

    feesDueBySession = [];






    constructor(public schoolService: SchoolService,
        public feeService: FeeService,
        public studentService: StudentService,
        public classService: ClassService,
        private excelService: ExcelService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewDefaultersServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        const monthNumber = (new Date()).getMonth();
        this.installmentNumber = (monthNumber > 2) ? monthNumber - 3 : monthNumber + 9;
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

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    handleLoading(): void {
        console.log(this.parentList);
        this.studentList.forEach(student => {

            let filteredStudentFeeList = this.studentFeeList.filter(studentFee => {
                return studentFee.parentStudent == student.id;
            });
            console.log(filteredStudentFeeList);
            let filteredStudentFeeSessions = [...new Set(filteredStudentFeeList.map(item => item.parentSession))];


            let filteredSubFeeReceiptList = this.subFeeReceiptList.filter(subFeeReceipt => {
                return filteredStudentFeeList.find(studentFee => {
                    return studentFee.id == subFeeReceipt.parentStudentFee;
                }) != undefined;
            });

            let filteredSubDiscountList = this.subDiscountList.filter(subDiscount => {
                return filteredStudentFeeList.find(studentFee => {
                    return studentFee.id == subDiscount.parentStudentFee;
                }) != undefined;
            });

            student['feesDueTillMonth'] = filteredStudentFeeList.reduce((total, studentFee) => {
                let filteredInstallmentList = [];
                if (studentFee.parentSession == this.currentSession.id) {
                    filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                    console.log(filteredInstallmentList);
                } else {
                    filteredInstallmentList = this.installmentList;
                }

                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment + 'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment + 'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                            if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                            }
                        }
                    }

                    return installmentAmount
                        + (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                let filteredInstallmentList = [];
                if (subFeeReceipt.parentSession == this.currentSession.id) {
                    filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                } else {
                    filteredInstallmentList = this.installmentList;
                }
                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                        + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                let filteredInstallmentList = [];
                if (subDiscount.parentSession == this.currentSession.id) {
                    filteredInstallmentList = this.installmentList.slice(0, this.installmentNumber + 1);
                } else {
                    filteredInstallmentList = this.installmentList;
                }
                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0)
                        + (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0);
                }, 0);
            }, 0);

            student['feesDueOverall'] = filteredStudentFeeList.reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment + 'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment + 'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                            if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                            }
                        }
                    }
                    return installmentAmount
                        + (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                        + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0)
                        + (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0);
                }, 0);
            }, 0);

            student['feesPaidThisSession'] = filteredSubFeeReceiptList.filter(subFeeReceipt => {
                return subFeeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                        + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
                }, 0);
            }, 0);

            student['discountThisSession'] = filteredSubDiscountList.filter(subDiscount => {
                return subDiscount.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subDiscount) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0)
                        + (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0);
                }, 0);
            }, 0);

            student['totalFeesThisSession'] = filteredStudentFeeList.filter(studentFee => {
                return studentFee.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment + 'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment + 'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                            if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                            }
                        }
                    }
                    return installmentAmount
                        + (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0)
                        + lateFeeAmount;
                }, 0);
            }, 0);

            this.feesDueBySession = [];
            let flag = filteredStudentFeeSessions.slice(-1)[0]
            filteredStudentFeeSessions.forEach(session => {
                let filteredStudentFeeListBySession = filteredStudentFeeList.filter(studentFee => {
                    return studentFee.parentSession == session;
                })
                let filteredSubFeeReceiptBySession = filteredSubFeeReceiptList.filter(subFeeReceipt => {
                    return subFeeReceipt.parentSession == session;
                })
                let filteredSubDiscountBySession = filteredSubDiscountList.filter(subDiscount => {
                    return subDiscount.parentSession == session;
                })


                let due = filteredStudentFeeListBySession.reduce((total, studentFee) => {
                    return total + this.installmentList.reduce((installmentAmount, installment) => {
                        let lateFeeAmount = 0;
                        if (studentFee[installment + 'LastDate'] && studentFee[installment + 'LateFee'] && studentFee[installment + 'LateFee'] > 0) {
                            let lastDate = new Date(studentFee[installment + 'LastDate']);
                            let clearanceDate = new Date();
                            if (studentFee[installment + 'ClearanceDate']) {
                                clearanceDate = new Date(studentFee[installment + 'ClearanceDate']);
                            }
                            let numberOfLateDays = Math.floor((clearanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                            if (numberOfLateDays > 0) {
                                lateFeeAmount = (studentFee[installment + 'LateFee'] ? studentFee[installment + 'LateFee'] : 0) * numberOfLateDays;
                                if (studentFee[installment + 'MaximumLateFee'] && studentFee[installment + 'MaximumLateFee'] < lateFeeAmount) {
                                    lateFeeAmount = studentFee[installment + 'MaximumLateFee'];
                                }
                            }
                        }
                        return installmentAmount
                            + (studentFee[installment + 'Amount'] ? studentFee[installment + 'Amount'] : 0)
                            + lateFeeAmount;
                    }, 0);
                }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                    return total + this.installmentList.reduce((installmentAmount, installment) => {
                        return installmentAmount
                            + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                            + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
                    }, 0);
                }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                    return total + this.installmentList.reduce((installmentAmount, installment) => {
                        return installmentAmount
                            + (subDiscount[installment + 'Amount'] ? subDiscount[installment + 'Amount'] : 0)
                            + (subDiscount[installment + 'LateFee'] ? subDiscount[installment + 'LateFee'] : 0);
                    }, 0);
                }, 0);

                let sessionName = this.sessionList.filter(sessionListItem => {
                    return sessionListItem.id == session;
                });


                let objectOffeesDueBySession = { parentSession: sessionName[0].name, due }
                this.feesDueBySession.push(objectOffeesDueBySession)


                if (flag == session) {
                    student['feesDueBySession'] = this.feesDueBySession;
                }

            })
            let studentSection = this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id
                    && studentSection.parentSession == this.user.activeSchool.currentSessionDbId;
            });

            student['class'] = this.classList.find(classs => {
                return studentSection.parentClass == classs.id;
            });

            student['section'] = this.sectionList.find(section => {
                return studentSection.parentDivision == section.id;
            });

            this.checkAndAddToFilteredClassSectionList(student['class'], student['section']);

            let parentObject = this.parentList.find(parent => {
                return parent.mobileNumber == student.mobileNumber
                    && parent.mobileNumber != null;
            });

            if (parentObject) {
                parentObject['studentList'].push(student);
            } else {
                let newParentObject = {
                    'name': student.fathersName,
                    'mobileNumber': student.mobileNumber,
                    'studentList': [student],
                    'notification': student.notification
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
            if (amount != 0) { return amount; }
            amount = b.feesDueOverall - a.feesDueOverall;
            if (amount != 0) { return amount; }
            amount = a.feesPaidThisSession - b.feesPaidThisSession;
            if (amount != 0) { return amount; }
            return b.totalFeesThisSession - a.totalFeesThisSession;
        });

        this.filteredClassSectionList = this.filteredClassSectionList.sort((a, b) => {
            let orderNumber = a.class.orderNumber - b.class.orderNumber
            if (orderNumber != 0) { return orderNumber; }
            return a.section.orderNumber - b.section.orderNumber;
        })
        this.studentDataSource = this.studentList
        this.parentDataSource = this.parentList
    }

    checkAndAddToFilteredClassSectionList(classs: any, section: any): void {
        if (this.filteredClassSectionList.find(classSection => {
            return classSection.class.id === classs.id && classSection.section.id === section.id;
        }) == undefined) {
            this.filteredClassSectionList.push({
                'class': classs,
                'section': section,
            });
        }
    }

    getStudentString = (studentList) => {
        let ret = '';
        studentList.forEach(student => {
            ret += student.name + ": " + this.getCurrencyInINR(student.feesDueTillMonth) + "\n";
        })
        return ret;
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for (let key in obj) {
            ret = ret.replace("<" + key + ">", obj[key]);
        }
        return ret;
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

    notifyDefaulters(): void {
        if (this.selectedFilterType == this.filterTypeList[0]) {
            let message = this.studentMessage;
            if (this.extraDefaulterMessage) {
                message += "\n" + this.extraDefaulterMessage;
            }
            let test = this.getFilteredStudentList().filter((item) => {
                return item.selected;
            })
            let mobile_numbers = test.filter((item) => item.mobileNumber).map((obj) => {
                return {
                    "fathersName": obj.fathersName,
                    "name": obj.name,
                    "mobileNumber": obj.mobileNumber,
                    "notification": obj.notification,
                    "feesDueTillMonth": this.getCurrencyInINR(obj.feesDueTillMonth),
                    "feesDueOverall": this.getCurrencyInINR(obj.feesDueOverall)
                }
            });
            this.serviceAdapter.sendSMSNotificationDefaulter(mobile_numbers, message);
        } else {
            let message = this.parentMessage;
            if (this.extraDefaulterMessage) {
                message += this.extraDefaulterMessage;
            }
            let test = this.getFilteredParentList().filter((item) => {
                return item.selected;
            })
            let mobile_numbers = test.filter((item) => item.mobileNumber).map((obj) => {
                return {
                    "name": obj.name,
                    "mobileNumber": obj.mobileNumber,
                    "notification": obj.notification,
                    "feesDueTillMonth": this.getCurrencyInINR(this.getParentFeesDueTillMonth(obj)),
                    "feesDueOverall": this.getCurrencyInINR(this.getParentFeesDueOverall(obj)),
                    "childrenData": this.getStudentString(obj.studentList)
                }
            });
            this.serviceAdapter.sendSMSNotificationDefaulter(mobile_numbers, message);
        }
    }

    getParameterValue = (student, parameter) => {
        try {
            return this.studentParameterValueList.find(x => x.parentStudent === student.id && x.parentStudentParameter === parameter.id).value
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
        let tempList = this.studentList.filter(student => {
            for (let x of this.studentParameterList) {
                let flag = x.showNone;
                x.filterValues.forEach(filter => {
                    flag = flag || filter.show
                })
                if (flag) {
                    let parameterValue = this.getParameterValue(student, x);
                    if (parameterValue == this.NULL_CONSTANT && x.showNone) {
                    } else if (!(x.filterValues.filter(filter => filter.show).map(filter => filter.name).includes(parameterValue))) {
                        return false;
                    }
                }
            }
            return true;
        });
        if (this.selectedClassSection) {
            tempList = tempList.filter(student => {
                return student.class.id == this.selectedClassSection.class.id
                    && student.section.id == this.selectedClassSection.section.id;
            });
        }
        if ((this.maximumNumber && this.maximumNumber != '')
            || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter(student => {
                let amount = student.feesDueTillMonth;
                return ((this.maximumNumber && this.maximumNumber != '') ? amount <= this.maximumNumber : true)
                    && ((this.minimumNumber && this.minimumNumber != '') ? amount >= this.minimumNumber : true)
            });
        }
        return tempList;
    }

    selectAllHandler = () => {
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.getFilteredStudentList().forEach(item => {
                item.selected = true;
            });
        } else {
            this.getFilteredParentList().forEach(item => {
                item.selected = true;
            });
        }
    }

    clearAllHandler = () => {
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.getFilteredStudentList().forEach(item => {
                item.selected = false;
            });
        } else {
            this.getFilteredParentList().forEach(item => {
                item.selected = false;
            });
        }
    }

    getFilteredStudentListFeesDueTillMonth(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student.feesDueTillMonth;
        }, 0);
    }

    getCurrentSessionName() {
        return this.sessionList.find(session => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        }).name;
    }


    getFilteredParentList(): any {
        let tempList = this.parentList;
        if ((this.maximumNumber && this.maximumNumber != '')
            || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter(parent => {
                let amount = parent.studentList.reduce((amount, student) => {
                    return amount + student['feesDueTillMonth'];
                }, 0);
                return ((this.maximumNumber && this.maximumNumber != '') ? amount <= this.maximumNumber : true)
                    && ((this.minimumNumber && this.minimumNumber != '') ? amount >= this.minimumNumber : true)
            });
        }
        return tempList;
    }

    getParentFeesDueTillMonth(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getFilteredParentListFeesDueTillMonth(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + this.getParentFeesDueTillMonth(parent);
        }, 0);
    }

    getParentFeesDueOverall(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesDueOverall'];
        }, 0);
    }
    getFilteredParentFeesDueOverall(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + parent.studentList.reduce((total, student) => {
                return total + student['feesDueOverall'];
            }, 0);
        }, 0);
    }

    getParentFeesPaid(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['feesPaidThisSession'];
        }, 0);
    }
    getFilteredParentTotalFeesPaid(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + parent.studentList.reduce((total, student) => {
                return total + student['feesPaidThisSession'];
            }, 0);
        }, 0);
    }


    getParentDiscount(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['discountThisSession'];
        }, 0);
    }

    getFilteredParentTotalDiscount(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + parent.studentList.reduce((total, student) => {
                return total + student['discountThisSession'];
            }, 0);
        }, 0);
    }

    getParentTotalFees(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    getFilteredParentTotalFees(): any {
        return this.getFilteredParentList().reduce((total, parent) => {
            return total + parent.studentList.reduce((total, student) => {
                return total + student['totalFeesThisSession'];
            }, 0);
        }, 0);
    }

    getFilteredStudentListTotalFeesDueTillMonth(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getFilteredStudentListTotalFeesDue(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesDueOverall'];
        }, 0);
    }
    getFilteredStudentListTotalFeesDemand(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    getFilteredStudentListTotalFeesPaid(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesPaidThisSession'];
        }, 0);
    }

    getFilteredStudentListTotalDiscount(): any {
        return this.getFilteredStudentList().reduce((total, student) => {
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

    downloadFeesReport(): void {

        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.downloadStudentFeesReport();
        } else {
            this.downloadParentFeesReport();
        }

    }

    getSelectedParentCount = () => {
        return this.getFilteredParentList().filter(item => {
            return item.selected && item.selected == true;
        }).length;
    }

    getSelectedChildrenCount = () => {
        return this.getFilteredStudentList().filter(item => item.selected).length;
    }

    printStudentFeesReport(): void {
        let template: any;
        template = [

            ['S No.', 'Student', 'Parent', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})`],

        ];

        let count = 0;
        this.getFilteredStudentList().forEach(student => {
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
            console.log(student.feesDueTillMonth);
        });
        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, { user: this.user, template: template });
    }

    printParentFeesReport(): void {

        let template: any;

        template = [

            ['S No.', 'Parent', 'Student', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`],

        ];

        let count = 0;
        this.getFilteredParentList().forEach(parent => {
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
                parent.studentList.forEach(student => {
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

        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, { user: this.user, template: template });
    }

    downloadStudentFeesReport(): void {

        let template: any;
        template = [

            ['S No.', 'Student', 'Parent', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Address', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})`],

        ];

        let count = 0;
        this.getFilteredStudentList().forEach(student => {
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

            ['S No.', 'Parent', 'Student', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Address', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`],

        ];

        let count = 0;
        this.getFilteredParentList().forEach(parent => {
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
                parent.studentList.forEach(student => {
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

    getExtraMessageLength = () => {
        return this.extraDefaulterMessage.length;
    }

    getNumberOfMobileDevice = () => {
        if (this.selectedFilterType == this.filterTypeList[0]) {
            return this.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).length;
        } else {
            return this.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).length;
        }
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        if (this.selectedSentType == this.sentTypeList[0]) return 0;
        if (this.selectedFilterType == this.filterTypeList[0]) {
            count = this.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).length;
        } else {
            count = this.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).length;
        }
        return count;
    }

    getEstimatedSMSCount = () => {
        let count = 0;
        if (this.selectedSentType == this.sentTypeList[1]) return 0;
        if (this.selectedFilterType == this.filterTypeList[0]) {
            this.getFilteredStudentList().filter(item => item.mobileNumber && item.selected).forEach((item, i) => {
                if (this.selectedSentType == this.sentTypeList[0] || item.notification == false) {
                    count += this.getMessageCount(this.getMessageFromTemplate(this.studentMessage, item) + '\n' + this.extraDefaulterMessage);
                }
            })
        } else {
            this.getFilteredParentList().filter(item => item.mobileNumber && item.selected).forEach((item, i) => {
                if (this.selectedSentType == this.sentTypeList[0] || item.notification == false) {
                    count += this.getMessageCount(this.getMessageFromTemplate(this.parentMessage, item) + '\n' + this.extraDefaulterMessage);
                }
            })
        }
        return count;
    }

    getButtonText(): any {
        return "Send " + this.getEstimatedSMSCount() + " SMS and " + this.getEstimatedNotificationCount() + " notifications";
    }

    getCurrencyInINR = (data) => {
        return "Rs. " + Number(data).toLocaleString('en-IN');
    }

    isMobile(): boolean {
        return isMobile();
    }

    hasPermission(): boolean {

        let moduleIdx = this.user.activeSchool.moduleList.findIndex(module => module.path == 'fees');

        if (this.user.activeSchool.moduleList[moduleIdx].taskList.findIndex(task => task.path == 'generate_fees_report') == -1)
            return false;

        return true;
    }
    getStudentFeeByStudentId(id:any):any{
        return this.myStudentFeeList.filter((studentFee)=>{
            return studentFee.parentStudent==id 
        });
    }
    getTotalLateFees(id:any):any{
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let amount=0;
        studentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=this.getStudentFeeInstallmentLateFeeTotal(studentFee,installment);
            });
        })
        return amount;
    }
    getTotalLateFeesDue(id:any):any{
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let amount=0;
        studentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=this.getStudentFeeInstallmentLateFeesDue(studentFee,installment);
            })
        })
        return amount;
    }
    getSessionBySessionName(sessionName:any):any{
      return  this.sessionList.find((session)=>{
            return session.name==sessionName;
        });
    }
    getSessionFeesDue(id:any,sessionName:any):any{
        let session=this.getSessionBySessionName(sessionName);
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList=studentFeeList.filter((studentFee)=>{
            return studentFee.parentSession==session.id ;
        });
        let amount=0;
        filteredStudentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=this.getStudentFeeInstallmentFeesDue(studentFee,installment,true);
            });
        });
        return amount;
    }
    getSessionTotalFees(id:any,sessionName:any):any{
        let session=this.getSessionBySessionName(sessionName);
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList=studentFeeList.filter((studentFee)=>{
            return studentFee.parentSession==session.id ;
        });
        let amount=0;
        filteredStudentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=studentFee[installment+"Amount"];
            });
        });
        return amount;
    }
    getSessionLateFeesDue(id:any,sessionName:any):any{
        let session=this.getSessionBySessionName(sessionName);
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList=studentFeeList.filter((studentFee)=>{
            return studentFee.parentSession==session.id ;
        });
        let amount=0;
        filteredStudentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=this.getStudentFeeInstallmentLateFeesDue(studentFee,installment,true);
            });
        });
        return amount;
    }
    getSessionLateFeeTotal(id:any,sessionName:any):any{
        let session=this.getSessionBySessionName(sessionName);
        let studentFeeList=this.getStudentFeeByStudentId(id);
        let filteredStudentFeeList=studentFeeList.filter((studentFee)=>{
            return studentFee.parentSession==session.id ;
        });
        let amount=0;
        filteredStudentFeeList.forEach((studentFee)=>{
            this.installmentList.forEach((installment)=>{
                amount+=this.getStudentFeeInstallmentLateFeeTotal(studentFee,installment);
            });
        });
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
    getStudentFeeInstallmentFeesDue(studentFee: any, installment: string, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee, includeNewSubFeeReceipt);
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

    getStudentFeeInstallmentLateFeesDue(studentFee: any, installment: string, includeNewSubFeeReceipt = true): number {
        let amount = 0;
        let filteredSubReceiptList = this.getFilteredSubFeeReceiptListByStudentFee(studentFee, includeNewSubFeeReceipt);
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
    getFilteredSubFeeReceiptListByStudentFee(studentFee: any, includeNewSubFeeReceipt = true): any {
        let filteredSubFeeReceiptList = this.subFeeReceiptList.filter((subFeeReceipt) => {
            return (
                subFeeReceipt.parentStudentFee == studentFee.id &&
                !this.myFeeReceiptList.find((feeReceipt) => {
                    return feeReceipt.id == subFeeReceipt.parentFeeReceipt;
                }).cancelled
            );
        });
        if (includeNewSubFeeReceipt) {
            let newSubFeeReceipt = this.newSubFeeReceiptList.find((subFeeReceipt) => {
                return subFeeReceipt.parentStudentFee == studentFee.id;
            });
            if (newSubFeeReceipt) {
                filteredSubFeeReceiptList.push(newSubFeeReceipt);
            }
        }
        return filteredSubFeeReceiptList;
    }
    getFilteredSubDiscountListByStudentFee(studentFee: any): any {
        let filteredSubDiscountList = this.subDiscountList.filter((subDiscount) => {
            return (
                subDiscount.parentStudentFee == studentFee.id &&
                !this.myDiscountList.find((discount) => {
                    return discount.id == subDiscount.parentDiscount;
                }).cancelled
            );
        });
        return filteredSubDiscountList;
    }
    createNewSubFeeReceipt(studentFee: any, installment: any, payment: any): void {
        let subFeeReceipt = new SubFeeReceipt();
        subFeeReceipt.parentStudentFee = studentFee.id;
        subFeeReceipt.parentFeeType = studentFee.parentFeeType;
        subFeeReceipt.parentSession = studentFee.parentSession;
        subFeeReceipt.isAnnually = studentFee.isAnnually;
        subFeeReceipt[installment] = payment;
        this.newSubFeeReceiptList.push(subFeeReceipt);

        this.checkAndCreateNewFeeReceipt(studentFee);
    }
    checkAndCreateNewFeeReceipt(studentFee: any): void {
        if (
            this.newFeeReceiptList.filter((feeReceipt) => {
                return feeReceipt.parentStudent == studentFee.parentStudent && feeReceipt.parentSession == studentFee.parentSession;
            }).length == 0
        ) {
            let feeReceipt = new FeeReceipt();
            feeReceipt.remark = this.newRemark;
            feeReceipt.cancelled = false;
            feeReceipt.parentStudent = studentFee.parentStudent;
            feeReceipt.parentSession = studentFee.parentSession;
            feeReceipt.parentSchool = this.user.activeSchool.dbId;
            feeReceipt.parentEmployee = this.user.activeSchool.employeeId;
            feeReceipt.modeOfPayment = this.newModeOfPayment;

            this.newFeeReceiptList.push(feeReceipt);
        }
    }
}
