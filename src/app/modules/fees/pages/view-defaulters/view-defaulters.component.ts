import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { ViewDefaultersServiceAdapter } from "./view-defaulters.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import {ClassOldService} from "../../../../services/modules/class/class-old.service";
import {NotificationService} from "../../../../services/modules/notification/notification.service";
import {UserService} from "../../../../services/modules/user/user.service";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {ExcelService} from "../../../../excel/excel-service";
import {DataStorage} from "../../../../classes/data-storage";
import {SchoolService} from "../../../../services/modules/school/school.service";

import { PrintService } from '../../../../print/print-service';
import { PRINT_FEES_REPORT} from '../../print/print-routes.constants';

@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [ FeeService, StudentService, ClassOldService, NotificationService, UserService, SmsService, SmsOldService, SchoolService],
})

export class ViewDefaultersComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;
    sessionList = [];

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

    notif_usernames = [];

    parentList = [];

    filterTypeList = [
        'Student',
        'Parent',
    ];

    selectedFilterType = this.filterTypeList[1];

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

    constructor(public schoolService : SchoolService,
                public feeService: FeeService,
                public studentService: StudentService,
                public classService: ClassOldService,
                private excelService: ExcelService,
                public notificationService: NotificationService,
                public userService: UserService,
                public smsService: SmsService,
                public smsOldService: SmsOldService,
                private cdRef: ChangeDetectorRef,
                private printService: PrintService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewDefaultersServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();       
                
        let monthNumber = (new Date()).getMonth();
        this.installmentNumber = (monthNumber > 2)?monthNumber-3:monthNumber+9;
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

        this.studentList.forEach(student => {

            let filteredStudentFeeList = this.studentFeeList.filter(studentFee => {
                return studentFee.parentStudent == student.id;
            });

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
                    filteredInstallmentList = this.installmentList.slice(0,this.installmentNumber+1);
                } else {
                    filteredInstallmentList = this.installmentList;
                }
                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (studentFee[installment+'MaximumLateFee'] && studentFee[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment+'MaximumLateFee'];
                            }
                        }
                    }

                    return installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                let filteredInstallmentList = [];
                if (subFeeReceipt.parentSession == this.currentSession.id) {
                    filteredInstallmentList = this.installmentList.slice(0,this.installmentNumber+1);
                } else {
                    filteredInstallmentList = this.installmentList;
                }
                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                let filteredInstallmentList = [];
                if (subDiscount.parentSession == this.currentSession.id) {
                    filteredInstallmentList = this.installmentList.slice(0,this.installmentNumber+1);
                } else {
                    filteredInstallmentList = this.installmentList;
                }
                return total + filteredInstallmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['feesDueOverall'] = filteredStudentFeeList.reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (studentFee[installment+'MaximumLateFee'] && studentFee[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment+'MaximumLateFee'];
                            }
                        }
                    }
                    return  installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0) - filteredSubFeeReceiptList.reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0) - filteredSubDiscountList.reduce((total, subDiscount) => {
                return total + this.installmentList.reduce( (installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['feesPaidThisSession'] = filteredSubFeeReceiptList.filter(subFeeReceipt => {
                return subFeeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subFeeReceipt) => {
                return total + this.installmentList.reduce( (installmentAmount, installment) => {
                    return installmentAmount
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['discountThisSession'] = filteredSubDiscountList.filter(subDiscount => {
                return subDiscount.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, subDiscount) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    return installmentAmount
                        + (subDiscount[installment+'Amount']?subDiscount[installment+'Amount']:0)
                        + (subDiscount[installment+'LateFee']?subDiscount[installment+'LateFee']:0);
                }, 0);
            }, 0);

            student['totalFeesThisSession'] = filteredStudentFeeList.filter(studentFee => {
                return studentFee.parentSession == this.user.activeSchool.currentSessionDbId;
            }).reduce((total, studentFee) => {
                return total + this.installmentList.reduce((installmentAmount, installment) => {
                    let lateFeeAmount = 0;
                    if (studentFee[installment+'LastDate'] && studentFee[installment+'LateFee'] && studentFee[installment+'LateFee'] > 0) {
                        let lastDate = new Date(studentFee[installment+'LastDate']);
                        let clearanceDate = new Date();
                        if (studentFee[installment+'ClearanceDate']) {
                            clearanceDate = new Date(studentFee[installment+'ClearanceDate']);
                        }
                        let numberOfLateDays = Math.floor((clearanceDate.getTime()-lastDate.getTime())/(1000*60*60*24));
                        if (numberOfLateDays > 0) {
                            lateFeeAmount = (studentFee[installment+'LateFee']?studentFee[installment+'LateFee']:0)*numberOfLateDays;
                            if (studentFee[installment+'MaximumLateFee'] && studentFee[installment+'MaximumLateFee'] < lateFeeAmount) {
                                lateFeeAmount = studentFee[installment+'MaximumLateFee'];
                            }
                        }
                    }
                    return installmentAmount
                        + (studentFee[installment+'Amount']?studentFee[installment+'Amount']:0)
                        + lateFeeAmount;
                }, 0);
            }, 0);

            let studentSection = this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id
                    && studentSection.parentSession == this.user.activeSchool.currentSessionDbId;
            });

            student['class'] = this.classList.find(classs => {
                return studentSection.parentClass == classs.dbId;
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

        this.studentList = this.studentList.sort((a,b) => {
            let amount = b.feesDueTillMonth - a.feesDueTillMonth;
            if (amount != 0) { return amount; }
            amount = b.feesDueOverall - a.feesDueOverall;
            if (amount != 0) { return amount; }
            amount = a.feesPaidThisSession - b.feesPaidThisSession;
            if (amount != 0) { return amount; }
            return b.totalFeesThisSession - a.totalFeesThisSession;
        });

        this.filteredClassSectionList = this.filteredClassSectionList.sort((a,b) => {
            let orderNumber = a.class.orderNumber-b.class.orderNumber
            if (orderNumber != 0) {return orderNumber;}
            return a.section.orderNumber-b.section.orderNumber;
        })

    }

    checkAndAddToFilteredClassSectionList(classs: any, section: any): void {
        if (this.filteredClassSectionList.find(classSection => {
            return classSection.class.dbId == classs.dbId && classSection.section.id == section.id;
        }) == undefined) {
            this.filteredClassSectionList.push({
                'class': classs,
                'section': section,
            });
        }
    }

    getStudentString = (studentList) => {
        let ret = "";
        studentList.forEach(student => {
            ret += student.name +": "+ this.getCurrencyInINR(student.feesDueTillMonth)+"\n";
        })
        return ret;
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace("<"+key+">", obj[key]);
        }
        return ret;
    }
    
    hasUnicode(message): boolean {
        for (let i=0; i<message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }
    
    getMessageCount = (message) => {
        if (this.hasUnicode(message)){
            return Math.ceil(message.length/70);
        }else{
            return Math.ceil( message.length/160);
        }
    }

    notifyDefaulters(): void{
        if(this.selectedFilterType == this.filterTypeList[0]){
            let message = this.studentMessage;
            if(this.extraDefaulterMessage){
                message+="\n"+this.extraDefaulterMessage;
            }
            let test = this.getFilteredStudentList().filter((item) => {
                return item.selected;
            })
            let mobile_numbers = test.filter((item)=> item.mobileNumber).map((obj) => {
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
        }else{
            let message = this.parentMessage;
            if(this.extraDefaulterMessage){
                message+=this.extraDefaulterMessage;
            }
            let test = this.getFilteredParentList().filter((item) => {
                return item.selected;
            })
            let mobile_numbers = test.filter((item)=> item.mobileNumber).map((obj) => {
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

    getFilteredStudentList(): any {
        let tempList = this.studentList;
        if (this.selectedClassSection) {
            tempList = tempList.filter(student => {
                return student.class.dbId == this.selectedClassSection.class.dbId
                    && student.section.id == this.selectedClassSection.section.id;
            });
        }
        if ((this.maximumNumber && this.maximumNumber != '')
            || (this.minimumNumber && this.minimumNumber != '')) {
            tempList = tempList.filter(student => {
                let amount = student.feesDueTillMonth;
                return ((this.maximumNumber && this.maximumNumber != '')?amount<=this.maximumNumber:true)
                    && ((this.minimumNumber && this.minimumNumber != '')?amount>=this.minimumNumber:true)
            });
        }
        return tempList;
    }

    selectAllHandler = () => {
        if(this.selectedFilterType == this.filterTypeList[0]){
            this.getFilteredStudentList().forEach(item => {
                item.selected = true;
            });
        }else{
            this.getFilteredParentList().forEach(item => {
                item.selected = true;
            });
        }
    }

    clearAllHandler = () => {
        if(this.selectedFilterType == this.filterTypeList[0]){
            this.getFilteredStudentList().forEach(item => {
                item.selected = false;
            });
        }else{
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

    getCurrentSessionName(){
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
                return ((this.maximumNumber && this.maximumNumber != '')?amount<=this.maximumNumber:true)
                    && ((this.minimumNumber && this.minimumNumber != '')?amount>=this.minimumNumber:true)
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

    getParentTotalFees(parent: any): any {
        return parent.studentList.reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    printFeesReport(): any {
        if (this.selectedFilterType==this.filterTypeList[0]) {
            this.printStudentFeesReport();
        } else {
            this.printParentFeesReport();
        }
    }
    
    downloadFeesReport(): void {

        if (this.selectedFilterType==this.filterTypeList[0]) {
            this.downloadStudentFeesReport();
        } else {
            this.downloadParentFeesReport();
        }

    }

    getSelectedParentCount = () =>{
        return this.getFilteredParentList().filter(item => {
            return item.selected && item.selected==true;
        }).length;
    }

    getSelectedChildrenCount = () => {
        return this.getFilteredStudentList().filter(item => item.selected).length;
    }

    printStudentFeesReport(): void {
        let template: any;
        template = [

            ['S No.', 'Student', 'Parent', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`,`Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})` ],

        ];

        let count = 0;
        this.getFilteredStudentList().forEach(student => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.fathersName);
            row.push(student.class.name+', '+student.section.name);
            row.push(student.mobileNumber);
            row.push(student.secondMobileNumber);
            row.push(student.feesDueTillMonth);
            row.push(student.feesDueOverall);
            row.push(student.totalFeesThisSession);
            row.push(student.feesPaidThisSession);
            row.push(student.discountThisSession);
            template.push(row);
        });
        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, {user: this.user, template});
    }

    printParentFeesReport(): void {

        let template: any;

        template = [

            ['S No.', 'Parent', 'Student', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)',`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`],

        ];

        let count = 0;
        this.getFilteredParentList().forEach(parent => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].class.name+', '+parent.studentList[0].section.name);
                row.push(parent.studentList[0].mobileNumber);
                row.push(parent.studentList[0].secondMobileNumber);
            } else {
                row.push('');
                row.push('');
                row.push(parent.studentList[0].mobileNumber);
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
                    newRow.push(student.class.name+', '+student.section.name);
                    newRow.push('');
                    newRow.push(student.secondMobileNumber);
                    newRow.push(student.feesDueTillMonth);
                    newRow.push(student.feesDueOverall);
                    newRow.push(student.totalFeesThisSession);
                    newRow.push(student.feesPaidThisSession);
                    newRow.push(student.discountThisSession);
                    template.push(newRow);
                });
            }
        });

        this.printService.navigateToPrintRoute(PRINT_FEES_REPORT, {user: this.user, template});
    }
    downloadStudentFeesReport(): void {

        let template: any;
        template = [

            ['S No.', 'Student', 'Parent', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)', `Total Fees (${this.getCurrentSessionName()})`,`Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()})` ],

        ];

        let count = 0;
        this.getFilteredStudentList().forEach(student => {
            let row = [];
            row.push(++count);
            row.push(student.name);
            row.push(student.fathersName);
            row.push(student.class.name+', '+student.section.name);
            row.push(student.mobileNumber);
            row.push(student.secondMobileNumber);
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

            ['S No.', 'Parent', 'Student', 'Class', 'Mobile No.', 'Mobile No. (2)', 'Fees Due (till month)',
                'Fees Due (overall)',`Total Fees (${this.getCurrentSessionName()})`, `Fees Paid (${this.getCurrentSessionName()})`, `Discount (${this.getCurrentSessionName()}))`],

        ];

        let count = 0;
        this.getFilteredParentList().forEach(parent => {
            let row = [];
            row.push(++count);
            row.push(parent.name);
            if (parent.studentList.length == 1) {
                row.push(parent.studentList[0].name);
                row.push(parent.studentList[0].class.name+', '+parent.studentList[0].section.name);
                row.push(parent.studentList[0].mobileNumber);
                row.push(parent.studentList[0].secondMobileNumber);
            } else {
                row.push('');
                row.push('');
                row.push(parent.studentList[0].mobileNumber);
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
                    newRow.push(student.class.name+', '+student.section.name);
                    newRow.push('');
                    newRow.push(student.secondMobileNumber);
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
        if(this.selectedFilterType == this.filterTypeList[0]){
            return this.getFilteredStudentList().filter((item) => {
                return item.selected;
            }).length;
        }else{
            return this.getFilteredParentList().filter((item) => {
                return item.selected;
            }).length;
        }
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        if(this.selectedSentType==this.sentTypeList[0])return 0;
        if(this.selectedFilterType == this.filterTypeList[0]){
            count = this.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).length;
        }else{
            count = this.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected && item.notification;
            }).length;
        }
        return count;
    }   

    getEstimatedSMSCount = () => {
        let count = 0;
        if(this.selectedSentType==this.sentTypeList[1])return 0;
        if(this.selectedFilterType == this.filterTypeList[0]){
            this.getFilteredStudentList().filter(item => item.mobileNumber && item.selected).forEach((item, i) => {
                if(this.selectedSentType==this.sentTypeList[0] || item.notification==false){
                    count += this.getMessageCount(this.getMessageFromTemplate(this.studentMessage, item) + '\n' + this.extraDefaulterMessage);
                }
            })
        }else{
            this.getFilteredParentList().filter(item=>item.mobileNumber && item.selected).forEach((item, i) => {
                if(this.selectedSentType==this.sentTypeList[0] || item.notification==false){
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

}
