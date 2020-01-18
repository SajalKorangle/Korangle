import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from "./generate-fees-certificate.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {PrintService} from "../../../../print/print-service";
import { PRINT_FEES_CERTIFICATE } from '../../print/print-routes.constants';
import {INSTALLMENT_LIST, ReceiptColumnFilter} from "../../classes/constants";
import {DataStorage} from "../../../../classes/data-storage";
import {Student} from '../../../../classes/student';
import {SchoolOldService} from '../../../../services/modules/school/school-old.service';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
    selector: 'generate-fees-certificate',
    templateUrl: './generate-fees-certificate.component.html',
    styleUrls: ['./generate-fees-certificate.component.css'],
    providers: [ FeeService, SchoolOldService, StudentOldService, SchoolService, SchoolOldService ],
})

export class GenerateFeesCertificateComponent implements OnInit {

    user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GenerateFeesCertificateServiceAdapter;

    isLoading = false;

    isStudentListLoading = false;
    selectedStudent: any;
    boardList: any;
    selectedStudentList = [];
    sessionList: any;
    selectedSession: any;
    feeTypeList = [];
    feeReceiptList = [];
    subFeeReceiptList = [];
    selectedStudentFeesList = [];
    installmentList = INSTALLMENT_LIST;
    feesPaid = [];

    constructor(public printService: PrintService,
                public schoolOldService: SchoolOldService,
                public schoolService: SchoolService,
                public studentService: StudentOldService,
                public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new GenerateFeesCertificateServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.getSessionList();
    }

    getSessionList(): void {
        this.schoolService.getObjectList(this.schoolService.session,{}).then(sessionList => {
            this.sessionList = sessionList;
            this.sessionList.every(session => {
                session.dbId = session.id;
                if (session.dbId === this.user.activeSchool.currentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        this.selectedStudentList.forEach((studentt, i) => {
            this.selectedStudent = studentt;
            this.selectedStudent.dbId = this.selectedStudent.id;
            const student_data = {
                studentDbId: this.selectedStudent.dbId,
                sessionDbId: this.selectedSession.dbId,
            };
            this.studentService.getStudentProfile(student_data, this.user.jwt).then(
                student => {
                    this.isLoading = false;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudentList[i]=student;
                    }
                }, error => {
                    this.isLoading = false;
                }
            );
        })
    }

    handleDetailsFromParentStudentFilter(details: any){

    }

    handleStudentListSelection(selectedStudents: any){
        this.selectedStudentList = selectedStudents;
        this.getStudentProfile();
        this.serviceAdapter.getStudentFeeProfile();
    }

    getSubFeeReciptTotalAmount(feeType: any, student:any): number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
                let x = this.feeReceiptList.find(item => {
                    return item.id == subFeeReceipt.parentFeeReceipt;
                });
                let date = new Date(x.generationDateTime);
                let month = date.getMonth();
                let april = 3;
                return subFeeReceipt.parentFeeType == feeType.id && month >= april
                    && subFeeReceipt.parentSession == this.selectedSession.dbId
                    && subFeeReceipt.parentStudent == student.id;
            }).reduce((totalSubFeeReceipt, subFeeReceipt) => {
                return totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                    return totalInstallment
                        + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                        + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                }, 0);
            }, 0);
    }

    calculateTotalFeesPaid(): any{
        this.selectedStudentList.forEach((student, index) => {
            let fees = ['Admission_Fee','Vehicle_Fee','Tution_Fee','Fine'];
            this.feeTypeList.forEach((feeType,index) => {
                student[fees[index]] = this.getSubFeeReciptTotalAmount(feeType, student);
            })
        })
    }

    printFeesCertificate(){
        let copies = 0;
        this.selectedStudentList.forEach(student => {
            if(student.Admission_Fee > 0 || student.Vehicle_Fee > 0 || student.Tution_Fee > 0 || student.fine > 0){
                student.feesPaid = true;
                copies++;
            }
            else{
                student.feesPaid = false;
                alert(student.name + "'s Fees Not Paid");
            }
        });
        if(copies > 0){
            const value = {
                studentProfileList: this.selectedStudentList,
                boardList: this.boardList,
                numberOfCopies: this.selectedStudentList.length,
                session: this.selectedSession,
            };
            this.printService.navigateToPrintRoute(PRINT_FEES_CERTIFICATE, {user: this.user, value});
        }
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
