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
    sessionList = [];

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
}