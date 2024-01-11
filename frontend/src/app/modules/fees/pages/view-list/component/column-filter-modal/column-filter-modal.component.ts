import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { INSTALLMENT_LIST } from "@modules/fees/classes/constants";
import { BehaviorSubject } from 'rxjs';

@Component({
    templateUrl: './column-filter-modal.component.html',
    styleUrls: ['./column-filter-modal.component.css']
})
export class ColumnFilterModalComponent implements OnInit {

    columnIndex: number;

    header$ = new BehaviorSubject<string>(null);

    COLUMN_TYPE_LIST = [
        {display: 'Fee Parameters', type: 'fee'},
        {display: 'Profile Parameters', type: 'profile'}
    ];
    selectedColumnType: 'profile' | 'fee';

    AMOUNT_TYPE_LIST = [
        {display: 'Dues', type: 'feeDue'},
        {display: 'Fee', type: 'fee'},
        {display: 'Paid', type: 'feePaid'},
        {display: 'Discount', type: 'discountGiven'}
    ];
    selectedAmountType: 'feeDue' | 'fee' | 'feePaid' | 'discountGiven';

    usefulSessionList: any;

    currentSessionId: any;

    feeTypeList: any;

    installmentList: any;

    mainAndLateFee: any;

    studentDisplayParameterList: any;
    selectedStudentParameter: any;

    minAmount: any;

    maxAmount: any;

    sortList = [
        {display: 'None', variable: null},
        {display: 'Ascending', variable: 'ascending'},
        {display: 'Descending', variable: 'descending'}
    ];
    selectedSort: any;

    isApplyButtonDisabled$ = new BehaviorSubject<any>(true);

    showDeleteBtn = true;

    constructor(
        public dialogRef: MatDialogRef<ColumnFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {

        // starts populate column index
        this.columnIndex = data['columnIndex'];
        // ends populate column index

        // starts populate header
        this.header$.next(data['columnFilter'] ? data['columnFilter'].header : '');
        // ends populate header

        // starts populate column type
        this.selectedColumnType = data['columnFilter'] ? data['columnFilter'].type : 'fee';
        // ends populate column type

        // starts populate amount type
        this.selectedAmountType = data['columnFilter'] ? (
            data['columnFilter']['type'] == 'fee' ? data['columnFilter']['variable']['amountType'] : 'feeDue'
        ) : 'feeDue';
        // ends populate amount type

        // starts populate useful session list
        this.usefulSessionList = data['usefulSessionList'].map(session => {
            return {
                ...session,
                selected: data['columnFilter'] ? (
                    data['columnFilter']['type'] == 'fee' ? (
                        data['columnFilter']['variable']['sessionList'] ? (
                            data['columnFilter']['variable']['sessionList'].includes(session.id)
                        ) : false
                    ) : false
                ) : false
            };
        });
        // ends populate useful session list

        this.currentSessionId = data['currentSessionId'];

        // starts populate fee type list
        this.feeTypeList = data['feeTypeList'].map(feeType => {
            return {
                ...feeType,
                selected: data['columnFilter'] ? (
                    data['columnFilter']['type'] == 'fee' ? (
                        data['columnFilter']['variable']['feeTypeList'] ? (
                            data['columnFilter']['variable']['feeTypeList'].includes(feeType.id)
                        ) : false
                    ) : false
                ) : false
            };
        });
        // ends populate fee type list

        // starts populate installment list
        this.installmentList = INSTALLMENT_LIST.map(installment => {
            return {
                name: installment,
                selected: data['columnFilter'] ? (
                    data['columnFilter']['type'] == 'fee' ? (
                        data['columnFilter']['variable']['installmentList'] ? (
                            data['columnFilter']['variable']['installmentList'].includes(installment)
                        ) : false
                    ) : false
                ) : false
            };
        });
        // ends populate installment list

        // starts main and late fee
        this.mainAndLateFee = data['columnFilter'] ? (
            data['columnFilter']['type'] == 'fee' ? (
                data['columnFilter']['variable']['mainAndLateFee'] ?
                    data['columnFilter']['variable']['mainAndLateFee'] : { mainFee: false, lateFee: false }
            ) : { mainFee: false, lateFee: false }
        ) : { mainFee: false, lateFee: false };
        // ends main and late fee

        // starts populate minimum Amount
        this.minAmount = data['columnFilter'] ? (
            data['columnFilter']['type'] == 'fee' ? (
                data['columnFilter']['variable']['minAmount'] ? (
                    data['columnFilter']['variable']['minAmount']
                ) : 0
            ) : 0
        ) : 0;
        // ends populate minimum Amount

        // starts populate maximum Amount
        this.maxAmount = data['columnFilter'] ? (
            data['columnFilter']['type'] == 'fee' ? (
                data['columnFilter']['variable']['maxAmount'] ? (
                    data['columnFilter']['variable']['maxAmount']
                ) : 0
            ) : 0
        ) : 0;
        // ends populate maximum Amount

        // starts populate sort
        this.selectedSort = data['columnFilter'] && data['columnFilter']['sort'] ?
            data['columnFilter']['sort']['type'] : this.sortList[0].variable;
        // ends populate sort

        // starts populate student parameter list
        this.studentDisplayParameterList = data['studentDisplayParameterList'];
        this.selectedStudentParameter = data['columnFilter'] ? (
            data['columnFilter']['type'] == 'profile' ?
                data['columnFilter']['variable'] : this.studentDisplayParameterList[0].variable
        ) : this.studentDisplayParameterList[0].variable;
        // ends populate student parameter list

        // starts populate is apply button disabled
        this.header$.asObservable().subscribe(header => {
            this.isApplyButtonDisabled$.next(!(header && header != ''));
        });
        // ends populate is apply button disabled

        // starts populate show delete button
        this.showDeleteBtn = data['columnFilter'] ? true : false;
        // ends populate show delete button

    }

    ngOnInit() { }

    /* Check Width - maxidth (575) */
    /* It is being used to style the page based on width.
     For a very small device, some "<br />" needs to removed. */
    checkWidth(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* Apply Button Clicked */
    applyClick(): void {

        let columnFilter = {};

        // starts populate header
        columnFilter['header'] = this.header$.getValue();
        // ends populate header

        // starts populate selected column type
        columnFilter['type'] = this.selectedColumnType;
        // ends populate selected column type

        // starts populate selected type and variable
        if (columnFilter['type'] == 'fee') {

            // starts populate selected amount type
            columnFilter['variable'] = {};
            columnFilter['variable']['amountType'] = this.selectedAmountType;
            // ends populate selected amount type

            // starts populate selected session list
            let selectedSessionList = this.usefulSessionList.filter(session => session.selected).map(session => session.id);
            if (selectedSessionList.length > 0) {
                columnFilter['variable']['sessionList'] = selectedSessionList;
            }
            // ends populate selected session list

            // starts populate selected fee type list
            let selectedFeeTypeList = this.feeTypeList.filter(feeType => feeType.selected).map(feeType => feeType.id);
            if (selectedFeeTypeList.length > 0) {
                columnFilter['variable']['feeTypeList'] = selectedFeeTypeList;
            }
            // ends populate selected fee type list

            // starts populate selected installment list
            let selectedInstallmentList = this.installmentList.filter(installment => installment.selected).map(installment => installment.name);
            if (selectedInstallmentList.length > 0) {
                columnFilter['variable']['installmentList'] = selectedInstallmentList;
            }
            // ends populate selected installment list

            // starts main and late fee
            if (
                this.mainAndLateFee.mainFee || this.mainAndLateFee.lateFee
            ) {
                columnFilter['variable']['mainAndLateFee'] = this.mainAndLateFee;
            }
            // ends main and late fee

            // starts populate minimum amount
            if (this.minAmount && !isNaN(this.minAmount) && this.minAmount > 0) {
                columnFilter['variable']['minAmount'] = this.minAmount;
            }
            // ends populate minimum amount

            // starts populate maximum amount
            if (this.maxAmount && !isNaN(this.maxAmount) && this.maxAmount > 0) {
                columnFilter['variable']['maxAmount'] = this.maxAmount;
            }
            // ends populate maximum amount

        } else {
            // starts populate student parameter
            columnFilter['variable'] = this.selectedStudentParameter;
            // ends populate student parameter
        }
        // ends populate selected type and variable

        // starts populate selected column type
        if (this.selectedSort) {
            columnFilter['sort'] = {
                type: this.selectedSort,
                time: Date.now()
            };
        }
        // ends populate selected column type

        this.dialogRef.close({
            columnIndex: this.columnIndex,
            columnFilter: columnFilter
        });

    }  // Ends: applyClick()

    deleteClick(): void {
        this.dialogRef.close({
            columnIndex: this.columnIndex,
            shouldDelete: true
        });
    }

}
