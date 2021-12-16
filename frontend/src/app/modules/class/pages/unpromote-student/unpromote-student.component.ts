import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { UnpromoteStudentServiceAdapter } from './unpromote-student.service.adapter';
import { UnpromoteStudentHtmlRenderer } from './unpromote-student.html.renderer';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

@Component({
    selector: 'app-unpromote-student',
    templateUrl: './unpromote-student.component.html',
    styleUrls: ['./unpromote-student.component.css'],
    providers: [],
})
export class UnpromoteStudentComponent implements OnInit {
    user;

    bothFilters = false;

    selectedStudent: any;
    selectedStudentSectionList = [];
    selectedStudentFeeReceiptList = [];
    selectedStudentDiscountList = [];
    selectedStudentDeleteDisabledReason = {};
    tcList: Array<TransferCertificateNew> = [];

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    isLoading = false;

    isStudentListLoading = false;

    serviceAdapter: UnpromoteStudentServiceAdapter;
    htmlRenderer: UnpromoteStudentHtmlRenderer;


    constructor() {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UnpromoteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new UnpromoteStudentHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
    }

    isStudentDeletableFromSession(): boolean {

        // Checking if student is already deleted from this session or not
        this.selectedStudentDeleteDisabledReason["isDeleted"] = this.selectedStudent.isDeleted;
        
        // Checking if the current session is not the latest one for the student (which means that this session is a middle session or not)
        this.selectedStudentDeleteDisabledReason["isMiddleSession"] = this.selectedStudentSectionList[this.selectedStudentSectionList.length - 1].parentSession !=
                                                                    this.user.activeSchool.currentSessionDbId;

        // Checking if the current session is the only session in which student is registered (If that's the case then student can't be deleted)                                                            
        this.selectedStudentDeleteDisabledReason["hasOnlyOneSession"] = this.selectedStudentSectionList.length == 1;
        
        // Checking if fee receipt is generated for the student in the current session which is not cancelled
        this.selectedStudentDeleteDisabledReason["hasFeeReceipt"] = this.selectedStudentFeeReceiptList.find((feeReceipt) => {
            return (
                feeReceipt.parentStudent == this.selectedStudent.id &&
                feeReceipt.parentSession == this.user.activeSchool.currentSessionDbId &&
                feeReceipt.cancelled == false
            );
        }) != undefined;

        // Checking if discount is generated for the student in the current session which is not cancelled
        this.selectedStudentDeleteDisabledReason["hasDiscount"] = this.selectedStudentDiscountList.find((discount) => {
            return (
                discount.parentStudent == this.selectedStudent.id && 
                discount.parentSession == this.user.activeSchool.currentSessionDbId &&
                discount.cancelled == false
            );
        }) != undefined;

        // Checking if any tc is generated for the student in the current session which is not cancelled
        this.selectedStudentDeleteDisabledReason["hasTC"] = this.tcList.find((tc) => {
            return (
                tc.parentStudent == this.selectedStudent.id &&
                tc.cancelledBy == null
            );
        }) != undefined

        return (
            !this.selectedStudentDeleteDisabledReason["isDeleted"] &&
            !this.selectedStudentDeleteDisabledReason["isMiddleSession"] &&
            !this.selectedStudentDeleteDisabledReason["hasOnlyOneSession"] &&
            !this.selectedStudentDeleteDisabledReason["hasFeeReceipt"] &&
            !this.selectedStudentDeleteDisabledReason["hasDiscount"] &&
            !this.selectedStudentDeleteDisabledReason["hasTC"]
        );
    }
}