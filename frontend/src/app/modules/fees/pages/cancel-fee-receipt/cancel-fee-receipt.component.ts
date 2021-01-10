import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CancelFeeReceiptServiceAdapter } from "./cancel-fee-receipt.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import {INSTALLMENT_LIST, MODE_OF_PAYMENT_LIST} from "../../classes/constants";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {DataStorage} from "../../../../classes/data-storage";
import {CancelFeeReceiptModalComponent} from '@modules/fees/components/cancel-fee-receipt-modal/cancel-fee-receipt-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'cancel-fee-receipt',
    templateUrl: './cancel-fee-receipt.component.html',
    styleUrls: ['./cancel-fee-receipt.component.css'],
    providers: [ FeeService, ClassService, StudentService, EmployeeService ],
})

export class CancelFeeReceiptComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;
    modeOfPaymentList = MODE_OF_PAYMENT_LIST;

     user;

    searchParameter:any;

    feeReceiptList: any;
    subFeeReceiptList = [];
    studentList = [];
    studentSectionList = [];
    classList = [];
    sectionList = [];
    employeeList = [];
    selectedStudentList=[];
    searchFilterList=['Receipt No./Cheque No.','Student\'s Name','Parent\'s Mobile No'];

    serviceAdapter: CancelFeeReceiptServiceAdapter;

    isLoading = false;
    searchBy: any;
    isStudentListLoading=false;
    showReceipts=false;

    constructor(public feeService: FeeService,
                public classService: ClassService,
                public studentService: StudentService,
                public employeeService: EmployeeService,
                private cdRef: ChangeDetectorRef,
                private dialog:MatDialog) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CancelFeeReceiptServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        const numRegex=/^\d+$/;
        if(this.searchBy===this.searchFilterList[0] || this.searchBy===this.searchFilterList[2]) {
            return !(value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
                value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
                value !== '8' && value !== '9') || (event.type==='paste' && numRegex.test(event.clipboardData.getData('text').trim()));
        }else{
            return true;
        }
    }

    getEmployeeName(feeReceipt: any): any {
        let employee = this.employeeList.find(employee => {
            return employee.id == feeReceipt.parentEmployee;
        });
        return employee?employee.name:null;
    }

    getStudent(feeReceipt: any): any {
        return this.studentList.find(student => {
            return student.id == feeReceipt.parentStudent;
        });
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).reduce((total, subFeeReceipt) => {
            return total + this.installmentList.reduce((amount, installment) => {
                return amount
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    handleParentOrStudentListSelection(studentList: any) {
         this.selectedStudentList = studentList[0];
        this.serviceAdapter.getFeeReceiptList();
    }


    getClassName(studentId: any, sessionId: any): any {
        return this.classList.find(classs => {
            return classs.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentClass;
        }).name;
    }

    getSectionName(studentId: any, sessionId: any): any {
        return this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentDivision;
        }).name;
    }

    showCancelReceiptModal(feeReceipt: any) {
        const dialogRef = this.dialog.open(CancelFeeReceiptModalComponent, {
            height: '440px',
            width: '540px',
            data: {
                user: this.user,
                feeReceipt: feeReceipt,
                totalAmount: this.getFeeReceiptTotalAmount(feeReceipt),
                studentName: this.getStudent(feeReceipt).name,
                classSection:this.getClassName(feeReceipt.parentStudent, feeReceipt.parentSession)+","+this.getSectionName(feeReceipt.parentStudent, feeReceipt.parentSession),
                fathersName:this.getStudent(feeReceipt).fathersName,
                collectedBy: this.getEmployeeName(feeReceipt),
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.serviceAdapter.cancelFeeReceipt(feeReceipt)
            }
        });
    }
}
