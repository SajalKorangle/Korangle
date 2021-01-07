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

import { WindowRefService } from "../../../../services/modules/sms/window-ref.service"
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

export interface PurchaseSMSDialogData {
    noOfSMS:any,
    price:any,
    purchase:any
}

@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [ StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService, WindowRefService],
})

export class SendSmsComponent implements OnInit {

    user;

    NULL_CONSTANT = null;

    showFilters = false;

    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    selectedSentType = 'SMS';

    includeSecondMobileNumber = false;

    invalidmobilenumber = false;

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

    nameFilter = "" ;

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
    purchase: any;


    constructor(public studentService: StudentService,
                public employeeService: EmployeeService,
                public classService: ClassService,
                public smsOldService: SmsOldService,
                public smsService: SmsService,
                public notificationService: NotificationService,
                public userService: UserService,
                public cdRef: ChangeDetectorRef,
                public winRef: WindowRefService,
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
        if(row.validMobileNumber)
        {
            return {
                'hoverRow': true,
            };
        }
        else    
        {
            return {
                'highlight': true,
            };
        }
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
            // by student's or father's name
            this.nameFilter = this.nameFilter.toString().toLowerCase().replace(/^\s+/gm,'');

            return this.nameFilter === ""
                || studentSection.student.name.toLowerCase().indexOf(this.nameFilter) === 0
                || studentSection.student.fathersName.toLowerCase().indexOf(this.nameFilter) === 0;

        }).filter(studentSection => {
            if (!(this.invalidmobilenumber && this.isMobileNumberValid(studentSection.student.mobileNumber))) {
                return true;
            }
            return false;
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


    openPurchaseSMSDialog(): void {

        console.dir(this.user,{depth:null});

        let moduleIdx = this.user.activeSchool.moduleList.findIndex(module => module.path === 'sms');
        let taskIdx = -1;
        if(moduleIdx != -1)
        {
            taskIdx   = this.user.activeSchool.moduleList[moduleIdx].taskList.find(task => task.path === 'purchase_sms');
        }
        if(moduleIdx === -1 || taskIdx === -1)
        {
            alert('Purchase sms permission denied');
            return;
        }
        const dialogRef = this.dialog.open(PurchaseSMSDialogComponent, {
            width: '1000px',
            data: {'noOfSMS':0,'price':0,'purchase':this.purchase},
            disableClose: true,
        });
    
        dialogRef.afterClosed().subscribe(result => {

            if(result.payment)
            {   
                let data = {
                    price : result.price,
                    noOfSMS : result.noOfSMS
                }
                this.serviceAdapter.createRzpayOrder(data);
            }
            else
            {
                alert('Purchase has been cancelled');
            }
        });
    }



}




@Component({
    selector: 'purchase-sms-dialog',
    templateUrl: 'purchase-sms-dialog.html',
    styleUrls: ['./send-sms.component.css'],
  })
  export class PurchaseSMSDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<PurchaseSMSDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: PurchaseSMSDialogData,
        public dialog: MatDialog,) {
    }
  
    onNoClick(): void {
        this.dialogRef.close({payment:false});
    }

    smsPlan = [
        { noOfSms: 5000,  price: 1250, selected:false },
        { noOfSms: 20000, price: 5000, selected:false },
        { noOfSms: 30000, price: 7200, selected:false }
      ];    
      SMSCount =0;
      price = 0;
      noOfSMS =0;

    
      value: number = 0;
      value1: number = 0;
    
    
      callSetBubble(event)
      { 
        let range = document.querySelector(".range");
        let bubble = document.querySelector(".bubble");
        this.setBubble(range,bubble);
      }
    
      setBubble(range, bubble) {
        const val = range.value;
        this.value = val;
        this.value1=0;
        const min = range.min ? range.min : 0;
        const max = range.max ? range.max : 100;
        const newVal = Number(((val - min) * 100) / (max - min));
        this.price = val / 5;
        bubble.innerHTML = val;
    
        // Sorta magic numbers based on size of the native UI thumb
        bubble.style.left = `calc(${val * (30/30000) +1}vw)`;
        for(let i=0;i<this.smsPlan.length;i++)
        this.smsPlan[i].selected = false;
      }
    
      selectThisPlan(event:any,plan:any)
      { 
        for(let i=0;i<this.smsPlan.length;i++)
        {
          this.smsPlan[i].selected = false;
        }
    
        plan.selected = true;
        this.value1 = plan.price;
      }
    
      isPayButtonDisabled()
      {
        if(this.value >0 || this.value1 >0)return false;
        return true;
      } 

      startPayment()
      { 
        this.data.purchase = true;
        this.data.noOfSMS = this.value1 ? this.value1 > 0 : this.price*5;
        if(this.value1 >0)
        {   
            for(let i=0;i<this.smsPlan.length;i++)
            {
                if(this.smsPlan[i].selected)
                this.data.noOfSMS = this.smsPlan[i].noOfSms;
            }
            this.data.price = this.value1;
        }
        else
        {   
            this.data.price = this.price;
            this.data.noOfSMS = this.value
        }
        
        this.dialogRef.close({payment:this.data.purchase, noOfSMS : this.data.noOfSMS, price :this.data.price});
      }
    
 
}
