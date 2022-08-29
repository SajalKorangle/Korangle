import {Component, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { MyApprovalRequestsServiceAdapter } from './my-approval-requests.service.adapter';
import { CommonFunctions } from './../../../../classes/common-functions';

import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { UseFortransactionDialogComponent } from './components/use-for-transaction-dialog/use-for-transaction-dialog.component';
import { Approval, APPROVAL_STATUS_CHOICES } from './../../../../services/modules/accounts/models/approval';

import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { EmployeeService } from './../../../../services/modules/employee/employee.service';
import { SchoolService } from './../../../../services/modules/school/school.service';
import {MyApprovalRequestsHtmlRenderer} from './my-approval-requests.html.renderer';

@Component({
    selector: 'my-approval-requests',
    templateUrl: './my-approval-requests.component.html',
    styleUrls: ['./my-approval-requests.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
        SchoolService,
    ]

})
export class MyApprovalRequestsComponent implements OnInit {

    user: any;
    serviceAdapter: MyApprovalRequestsServiceAdapter;
    htmlRenderer: MyApprovalRequestsHtmlRenderer;

    accountsLockedForSession: boolean = false;

    newApprovalList: Array<NewCustomApproval> = [];

    approvalsList: any = [];
    loadingCount = 10;

    accountsList: any;
    employeeList: any;


    minimumDate: any;
    maximumDate: any;

    moreApprovalsCount: number = 1;

    moreAprovalsAvailable: boolean = true;
    isLoadingApproval: boolean = false;

    isLoading: boolean = false;

    constructor(
        public dialog: MatDialog,
        public accountsService: AccountsService,
        public employeeService: EmployeeService,
        public schoolService: SchoolService,
    ) { }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.htmlRenderer = new MyApprovalRequestsHtmlRenderer();
        this.htmlRenderer.initialise(this);
        this.serviceAdapter = new MyApprovalRequestsServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();
        this.newApprovalList = [new NewCustomApproval(this, {autoAdd: false})];

    }

    inActiveSession(): boolean {
        const today = new Date();
        const sessionStartDate = new Date(this.minimumDate);
        const sessionEndDate = new Date(this.maximumDate);
        return today >= sessionStartDate && today <= sessionEndDate;
    }

    getButtonStyle(approval) {
        let style = {
            'background': null,
            'color': 'white',
            'border': null,
        };
        if (approval.requestStatus == 'PENDING' || approval.parentTransaction != null ) {
            style.background = 'rgba(196, 196, 196, 1)';
            style.border = '2px solid rgba(196, 196, 196, 1)';
        }
        else if (approval.requestStatus == 'APPROVED') {
            style.background = 'rgba(76, 175, 80, 1)';
            style.border = '2px solid rgba(76, 175, 80, 1)';
        }
        if (approval.requestStatus == 'DECLINED') {
            style.background = 'rgb(244 67 52';
            style.border = '2px solid rgb(244 67 52)';
        }

        return style;
    }

    getButtonString(approval): string {
        if (approval.parentTransaction != null) {
            return 'Used';
        }
        else if (approval.requestStatus == 'PENDING') {
            return 'Pending';
        }
        else if (approval.requestStatus == 'APPROVED') {
            return 'Granted';
        }
        else {
            return 'Declined';
        }
    }

    openImagePreviewDialog(images: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'images': images, 'index': index, 'editable': editable, 'isMobile': false}
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openUseForPaymentDialog(approval: any): void {
        const dialogRef = this.dialog.open(UseFortransactionDialogComponent, {
            data: {'approval': JSON.parse(JSON.stringify(approval)), 'originalApproval': approval, 'vm': this}
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getDisplayDateFormat(str : any) {
        // return str;
        let d = new Date(str);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    addNewAccount(accountList): void {
        accountList.push({ account: null, amount: null });
    }

    addAprovalImage(event: any, imageType: string, newCustomApproval: NewCustomApproval): void {
        if (event.target.files && event.target.files[0]) {
            let image = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => {
                const approvalImageStructure = {
                    orderNumber: null,
                    imageURL: reader.result,
                };
                if (imageType == 'bill') {
                    newCustomApproval.billImages.push(approvalImageStructure);
                }
                else {
                    newCustomApproval.quotationImages.push(approvalImageStructure);
                }
            };
            reader.readAsDataURL(image);
        }
    }

    addApprovals(): void {
        const attributes = {};
        if (this.newApprovalList.length > 0 && this.newApprovalList[this.newApprovalList.length - 1].autoAdd) {
            attributes['autoAdd'] = true;
        }
        for (let i = 0; i < this.moreApprovalsCount; i++) {
            this.newApprovalList.push(new NewCustomApproval(this, attributes));
        }
    }

    handleAmountChange(approval: NewCustomApproval, newAmount: number): void {
        if (approval.payTo.length == 1 && approval.payFrom.length == 1) {
            approval.payFrom[0].amount = newAmount;
            approval.payTo[0].amount = newAmount;
        }
        else if (approval.payTo.length == 1) {
            approval.payTo[0].amount = approval.payFrom.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
        }
        else if (approval.payFrom.length == 1) {
            approval.payFrom[0].amount = approval.payTo.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
        }
    }

    isAccountNotMentioned(approval: NewCustomApproval): boolean {
        let temp = false;
        approval.payFrom.forEach(acc => {
            if (acc.account == null) {
                temp = true;
                return;
            }
        });

        approval.payTo.forEach(acc => {
            if (acc.account == null) {
                temp = true;
                return;
            }
        });
        return temp;
    }

    isAmountUnEqual(approval: NewCustomApproval): boolean {
        let totalCreditAmount = 0;
        approval.payTo.forEach(acc => {
            totalCreditAmount += acc.amount;
        });
        let totalDebitAmount = 0;
        approval.payFrom.forEach(acc => {
            totalDebitAmount += acc.amount;
        });
        return !(totalCreditAmount == totalDebitAmount);
    }

    isAmountLessThanMinimum(approval: NewCustomApproval): boolean {
        let temp = false;
        approval.payFrom.forEach(acc => {
            if (acc.amount < 0.01 && acc.account != null) {
                temp = true;
            }
        });
        approval.payTo.forEach(acc => {
            if (acc.amount < 0.01 && acc.account != null) {
                temp = true;
            }
        });
        return temp;
    }

    isAccountRepeated(approval: NewCustomApproval): boolean {
        for (let i = 0; i < approval.payFrom.length; i++) {
          if (approval.payFrom[i].account != null) {
              for (let j = i + 1; j < approval.payFrom.length; j++) {
                if (approval.payFrom[j].account == approval.payFrom[i].account) {
                    return true;
                }
            }
            for (let j = 0; j < approval.payTo.length; j++) {
              if (approval.payTo[j].account == approval.payFrom[i].account) {
                  return true;
              }
            }
          }
        }

        for (let i = 0; i < approval.payTo.length ; i++) {
          if (approval.payTo[i].account != null) {
            for (let j = i + 1; j < approval.payTo.length; j++) {
              if (approval.payTo[j].account == approval.payTo[i].account) {
                  return true;
              }
            }
          }
        }

        return false;
    }

    isDataNotFilled(): boolean {
        let result = false;
        this.newApprovalList.forEach(approval => {
            approval.payTo.forEach(acc => {
                if (!acc.account || !acc.amount)
                    result =  true;
            });
            approval.payFrom.forEach(acc => {
                if (!acc.account || !acc.amount)
                    result =  true;
            });
        });
        return result;
    }

    checkDataValidity(): boolean {
        if (this.isDataNotFilled())
            return false;
        let result = true;
        this.newApprovalList.forEach(approval => {
            if (this.isAccountRepeated(approval) ||
                this.isAmountLessThanMinimum(approval) ||
                this.isAmountUnEqual(approval) ||
                this.isAccountNotMentioned(approval)) {
                result = false;
                }
        });
        return result;
    }

    requestApproval(): void {
        if (!this.checkDataValidity()) {
            alert('Data not valid!');
            return;
        }
        this.serviceAdapter.requestApprovals();
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

}

export class NewCustomApproval extends Approval{
    structure: 'simple' | 'advance' = 'simple';

    payTo: Array<{account: number, amount: number}> = [{account: null, amount: null}];
    payFrom: Array<{ account: number, amount: number }> = [{ account: null, amount: null }];

    billImages: Array<{imageURL: any, orderNumber: number}> = [];
    quotationImages: Array<{ imageURL: any, orderNumber: number; }> = [];

    simple: boolean = true;

    constructor(vm: MyApprovalRequestsComponent, attributes = {}) {
        super();
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        this.parentEmployeeRequestedBy = vm.user.activeSchool.employeeId;
        this.requestedGenerationDateTime = CommonFunctions.formatDate(new Date().toDateString(), '');
        this.requestStatus = 'PENDING';
    }
  }
