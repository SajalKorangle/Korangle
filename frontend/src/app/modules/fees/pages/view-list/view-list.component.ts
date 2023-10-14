import {  Component, OnInit } from '@angular/core';
import { ViewListServiceAdapter } from './view-list.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { ViewListHtmlRenderer } from './view-list.html.renderer';
import { ViewListStreamVariables } from './view-list.stream.variables';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { INSTALLMENT_LIST } from '@modules/fees/classes/constants';
import xlsx = require('xlsx');

@Component({
    selector: 'view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.css'],
})

export class ViewListComponent implements OnInit {

    user;

    studentSectionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    intermediaryStudentSectionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    tcList$: BehaviorSubject<any> = new BehaviorSubject(null);

    classList$: BehaviorSubject<any> = new BehaviorSubject(null);

    sectionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    sessionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    feeTypeList$: BehaviorSubject<any> = new BehaviorSubject(null);

    studentParameterList$: BehaviorSubject<any> = new BehaviorSubject(null);

    studentCustomFilterList$: BehaviorSubject<any> = new BehaviorSubject(null);

    studentParameterValueList$: BehaviorSubject<any> = new BehaviorSubject(null);

    studentListFilter$: BehaviorSubject<any> = new BehaviorSubject(null);

    usefulSessionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    searchText$ = new BehaviorSubject<any>(null);

    selectedSearchParameter$ = new BehaviorSubject<any>(null);

    studentDisplayParameterList$ = new BehaviorSubject<any>(null);

    installmentList = INSTALLMENT_LIST;

    DEFAULT_COLUMN_LIST_FILTER = [
        {header: 'Name', type: 'profile', variable: 'name'},
        {header: 'Father\'s Name', type: 'profile', variable: 'fathersName'},
        {header: 'Mobile Number', type: 'profile', variable: 'mobileNumber'},
        {header: 'Total Fees Due', type: 'fee', variable: {amountType: 'feeDue', minAmount: 1}, sort: 'descending'},
    ];
    columnListFilter$: BehaviorSubject<any> = new BehaviorSubject(this.DEFAULT_COLUMN_LIST_FILTER);

    filteredStudentSectionList$: BehaviorSubject<any> = new BehaviorSubject(null);

    intialReportList$ = new BehaviorSubject<any>(null);

    // isInitialLoading will be false only after it becomes an array.
    // so initial null value doesn't have much affect anywher
    reportList$ = new BehaviorSubject<any>(null);
    selectedReport$ = new BehaviorSubject<any>(null); // null means 'create new report' is selected.

    selectedReportName$ = new BehaviorSubject<any>(null);

    reportMightHaveChanged$ = new BehaviorSubject<boolean>(false);

    NULL_VALUE = null;

    showUpdateBtn$ = new BehaviorSubject<boolean>(false);
    updateBtnClicked$ = new BehaviorSubject<any>(null);
    isUpdateBtnDisabled$ = new BehaviorSubject<any>(null);
    updateBtnToolTip$ = new BehaviorSubject<any>(null);

    showDeleteBtn$ = new BehaviorSubject<boolean>(false);
    deleteBtnClicked$ = new BehaviorSubject<any>(null);

    isSaveNewBtnDisabled$ = new BehaviorSubject<boolean>(true);
    saveNewBtnToolTip$ = new BehaviorSubject<string>('');
    saveNewBtnClicked$ = new BehaviorSubject<any>(null);

    recentlySavedReport$ = new BehaviorSubject<any>(null);
    recentlyUpdatedReport$ = new BehaviorSubject<any>(null);
    recentlyDeletedReportId$ = new BehaviorSubject<any>(null);

    // Starts : HTML Event Variables
    openStudentListFilterDialogBtnClicked$: BehaviorSubject<any> = new BehaviorSubject(null);

    openColumnFilterDialogBtnClicked$: BehaviorSubject<any> = new BehaviorSubject(null);

    columnDragged$: BehaviorSubject<any> = new BehaviorSubject(null);
    // Ends : HTML Event Variables

    isInitialLoading$ = new BehaviorSubject<any>(false);

    serviceAdapter: ViewListServiceAdapter;
    htmlRenderer: ViewListHtmlRenderer;
    streamVariables: ViewListStreamVariables;

    constructor(
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewListServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ViewListHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        this.streamVariables = new ViewListStreamVariables(this);
        this.streamVariables.intializeData();

    }

    getValue(student, type, parameter) : any {
        switch (type) {
            case 'profile':
                return student[parameter];
            case 'fee':
                let mainFee = parameter['mainAndLateFee'] && !parameter['mainAndLateFee']['mainFee'] ? false : true;
                let lateFee = parameter['mainAndLateFee'] && !parameter['mainAndLateFee']['lateFee'] ? false : true;
                return student['feeDetailsList'].filter((feeDetails) => {
                    return !(
                        parameter['sessionList'] && !parameter['sessionList'].includes(feeDetails.parentSession)
                        || parameter['feeTypeList'] && !parameter['feeTypeList'].includes(feeDetails.parentFeeType)
                    );
                }).reduce((total, feeDetails) => {
                    return total + this.installmentList.filter((installment) => {
                        return !(parameter['installmentList'] && !parameter['installmentList'].includes(installment));
                    }).reduce((total2, installment) => {
                        switch (parameter['amountType']) {
                            case 'feeDue':
                                return total2 + (
                                    mainFee && feeDetails[installment + 'Fee'] ? feeDetails[installment + 'Fee'] : 0
                                ) + (
                                    lateFee && feeDetails[installment + 'LateFee'] ? feeDetails[installment + 'LateFee'] : 0
                                ) - (
                                    mainFee && feeDetails[installment + 'FeePaid'] ? feeDetails[installment + 'FeePaid'] : 0
                                ) - (
                                    lateFee && feeDetails[installment + 'LateFeePaid'] ? feeDetails[installment + 'LateFeePaid'] : 0
                                ) - (
                                    mainFee && feeDetails[installment + 'DiscountGiven'] ? feeDetails[installment + 'DiscountGiven'] : 0
                                ) - (
                                    lateFee && feeDetails[installment + 'LateFeeDiscountGiven'] ? feeDetails[installment + 'LateFeeDiscountGiven'] : 0
                                );
                            case 'fee':
                                return total2 + (
                                    mainFee && feeDetails[installment + 'Fee'] ? feeDetails[installment + 'Fee'] : 0
                                ) + (
                                    lateFee && feeDetails[installment + 'LateFee'] ? feeDetails[installment + 'LateFee'] : 0
                                );
                            case 'feePaid':
                                return total2 + (
                                    mainFee && feeDetails[installment + 'FeePaid'] ? feeDetails[installment + 'FeePaid'] : 0
                                ) + (
                                    lateFee && feeDetails[installment + 'LateFeePaid'] ? feeDetails[installment + 'LateFeePaid'] : 0
                                );
                            case 'discountGiven':
                                return total2 + (
                                    mainFee && feeDetails[installment + 'DiscountGiven'] ? feeDetails[installment + 'DiscountGiven'] : 0
                                ) + (
                                    lateFee && feeDetails[installment + 'LateFeeDiscountGiven'] ? feeDetails[installment + 'LateFeeDiscountGiven'] : 0
                                );
                        }
                    }, 0);
                }, 0);
        }
    }

    download(): void {

        let ws = xlsx.utils.aoa_to_sheet(
            [this.columnListFilter$.getValue().map(column => column.header)].concat(
                this.filteredStudentSectionList$.getValue()
            )
        );
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, 'korangle_fees_report.xlsx');

    }

}