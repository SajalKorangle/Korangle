import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from "./generate-fees-certificate.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {PrintService} from "../../../../print/print-service";
import { PRINT_FEES_CERTIFICATE } from '../../print/print-routes.constants';
import {INSTALLMENT_LIST, ReceiptColumnFilter} from "../../classes/constants";
import {DataStorage} from "../../../../classes/data-storage";
import {Student} from '../../../../classes/student';
import {StudentService} from '../../../../services/modules/student/student.service';
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
    selector: 'generate-fees-certificate',
    templateUrl: './generate-fees-certificate.component.html',
    styleUrls: ['./generate-fees-certificate.component.css'],
    providers: [ FeeService, SchoolService, StudentService ],
})

export class GenerateFeesCertificateComponent implements OnInit {

    user;

    serviceAdapter: GenerateFeesCertificateServiceAdapter;

    isLoading = false;

    isStudentListLoading = false;
    boardList: any;
    selectedStudentList = [];
    sessionList: any;
    selectedSession: any;
    feeTypeList = [];
    feeReceiptList = [];
    subFeeReceiptList = [];
    installmentList = INSTALLMENT_LIST;

    certificateNumber: any;

    constructor(public printService: PrintService,
                public schoolService: SchoolService,
                public studentService: StudentService,
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
                if (session.id === this.user.activeSchool.currentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    getStudentProfile(selectedStudentList): void {
        this.isLoading = true;

        let request_student_data = {
            'id__in': selectedStudentList.map(student => {return student.id}).join(),
        }

        this.studentService.getObjectList(this.studentService.student ,request_student_data).then(
            value =>{
                this.selectedStudentList = value;
                this.serviceAdapter.getStudentFeeProfile();
            },
            error => {
                this.isLoading = false;
            }
        );
    }

    handleDetailsFromParentStudentFilter(details: any){

    }

    handleStudentListSelection(selectedStudents: any){
        this.getStudentProfile(selectedStudents);
    }

    getFeesPaidByFeeType(feeType: any, student: any):number {
        let studentFeeReceiptList = this.feeReceiptList.filter(feeReceipt =>{
            return feeReceipt.parentStudent == student.id;
        });

        let studentSubFeeReceiptList = this.subFeeReceiptList.filter(item => {
            return studentFeeReceiptList.find(feeRecipt => { return feeRecipt.id == item.parentFeeReceipt}) != undefined;
        });

        let totalAmountPaid = 0;
        studentSubFeeReceiptList.forEach(subFeeReceipt => {
            if(subFeeReceipt.parentFeeType == feeType.id){
                this.installmentList.forEach(installment => {
                    totalAmountPaid += (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0);
                    totalAmountPaid += (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
                });                
            }
        });
        return totalAmountPaid;
    }

    getTotalFeesPaidByStudent(student: any):number {
        let studentFeeReceiptList = this.feeReceiptList.filter(feeReceipt =>{
            return feeReceipt.parentStudent == student.id;
        });

        let studentSubFeeReceiptList = this.subFeeReceiptList.filter(item => {
            return studentFeeReceiptList.find(feeRecipt => { return feeRecipt.id == item.parentFeeReceipt}) != undefined;
        });

        let totalAmountPaid = 0;
        studentSubFeeReceiptList.forEach(subFeeReceipt => {
            this.installmentList.forEach(installment => {
                totalAmountPaid += (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0);
                totalAmountPaid += (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            });                
        });
        return totalAmountPaid;
    }

    getTotalFeesPaid(): number {
        let totalAmount = 0;
        this.selectedStudentList.forEach(student => {
            totalAmount += this.getTotalFeesPaidByStudent(student);
        });
        return totalAmount;
    }
    printFeesCertificate(){
        // not modified
        let copies = 0;
        console.log(this.selectedStudentList);
        this.selectedStudentList.forEach(student => {
            if(student){
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
