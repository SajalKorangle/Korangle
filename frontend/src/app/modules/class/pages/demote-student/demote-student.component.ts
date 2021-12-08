import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { DemoteStudentServiceAdapter } from './demote-student.service.adapter';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

@Component({
    selector: 'app-demote-student',
    templateUrl: './demote-student.component.html',
    styleUrls: ['./demote-student.component.css'],
    providers: [FeeService, StudentService, SubjectService, ExaminationService, TCService],
})
export class DemoteStudentComponent implements OnInit {
    user;

    bothFilters = false;

    selectedStudent: any;
    selectedStudentSectionList = [];
    selectedStudentFeeReceiptList = [];
    selectedStudentDiscountList = [];
    selectedStudentDeleteDisabledReason = {};
    tcList: Array<TransferCertificateNew> = [];
    isDeleteFromSessionEnabled = true;

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    isLoading = false;

    isStudentListLoading = false;

    serviceAdapter: DemoteStudentServiceAdapter;

    constructor(
        public studentService: StudentService,
        public subjectService: SubjectService,
        public examinationOldService: ExaminationService,
        public feeService: FeeService,
        public tcService: TCService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new DemoteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
    }

    enableDeleteFromSession(): boolean {

        this.selectedStudentDeleteDisabledReason["isDeleted"] = this.selectedStudent.deleted;
        
        this.selectedStudentDeleteDisabledReason["isMiddleSession"] = this.selectedStudentSectionList[this.selectedStudentSectionList.length - 1].parentSession !=
                                                                    this.user.activeSchool.currentSessionDbId;
        
        this.selectedStudentDeleteDisabledReason["hasFeeReceipt"] = this.selectedStudentFeeReceiptList.find((feeReceipt) => {
            return (
                feeReceipt.parentStudent == this.selectedStudent.id &&
                feeReceipt.parentSession == this.user.activeSchool.currentSessionDbId &&
                feeReceipt.cancelled == false
            );
        }) != undefined;

        this.selectedStudentDeleteDisabledReason["hasDiscount"] = this.selectedStudentDiscountList.find((discount) => {
            return (
                discount.parentStudent == this.selectedStudent.id && 
                discount.parentSession == this.user.activeSchool.currentSessionDbId &&
                discount.cancelled == false
            );
        }) != undefined;

        this.selectedStudentDeleteDisabledReason["hasTC"] = this.selectedStudentHasTc();

        return (
            !this.selectedStudentDeleteDisabledReason["isDeleted"] &&
            !this.selectedStudentDeleteDisabledReason["isMiddleSession"] &&
            !this.selectedStudentDeleteDisabledReason["hasFeeReceipt"] &&
            !this.selectedStudentDeleteDisabledReason["hasDiscount"] &&
            !this.selectedStudentDeleteDisabledReason["hasTC"]
        );
    }

    selectedStudentHasTc(): boolean {
        return this.tcList.find((tc) => {
            return (
                tc.parentStudent == this.selectedStudent.id &&
                tc.cancelledBy == null
            );
        }) != undefined
    }
}
