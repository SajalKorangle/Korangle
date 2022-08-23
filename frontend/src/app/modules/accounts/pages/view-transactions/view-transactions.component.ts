import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { EmployeeService } from './../../../../services/modules/employee/employee.service';
import { ViewTransactionsServiceAdapter } from './view-transactions.service.adapter';
import { CommonFunctions } from './../../../../classes/common-functions';
import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { PrintService } from '../../../../print/print-service';
import { ExcelService } from '../../../../excel/excel-service';
import { SchoolService } from './../../../../services/modules/school/school.service';
import { UpdateTransactionDialogComponent } from './../../components/update-transaction-dialog/update-transaction-dialog.component';
import { HEADS_LIST } from './../../classes/constants';

@Component({
    selector: 'view-transactions',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
        SchoolService,
    ]
})

export class ViewTransactionsComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: ViewTransactionsServiceAdapter;
    minimumDate: any;
    maximumDate: any;

    isInitialLoading: any = false;
    isLoading: boolean = false;

    startDate;
    endDate;

    columnFilter: {
        voucherNumber: {
            displayName: string,
            value: boolean,
        },
        date: {
            displayName: string,
            value: boolean,
        },
        debitAccount: {
            displayName: string,
            value: boolean,
        },
        creditAccount: {
            displayName: string,
            value: boolean,
        },
        remark: {
            displayName: string,
            value: boolean,
        },
        approvalId: {
            displayName: string,
            value: boolean,
        },
        addedBy: {
            displayName: string,
            value: boolean,
        },
        quotation: {
            displayName: string,
            value: boolean,
        },
        bill: {
            displayName: string,
            value: boolean,
        };
    } = {
            voucherNumber: {
                displayName: 'Voucher Number',
                value: true,
            },

            date: {
                displayName: 'Date',
                value: true,
            },
            debitAccount: {
                displayName: 'Debit A/C',
                value: true,
            },
            creditAccount: {
                displayName: 'Credit A/C',
                value: true,
            },
            remark: {
                displayName: 'Remark',
                value: false,
            },
            approvalId: {
                displayName: 'Approval ID',
                value: false,
            },
            addedBy: {
                displayName: 'Added By',
                value: true,
            },
            quotation: {
                displayName: 'Quotations',
                value: false,
            },
            bill: {
                displayName: 'Bills',
                value: false,
            }
        };


    transactionsList: any;
    employeeList = [];
    accountsList: any;
    groupsList: any;
    headsList = HEADS_LIST;

    filterColumnsList: any;
    filterAccountsList: any;
    filterEmployeeList: any;
    filterHeadsList: any;
    filterGroupsList: any;

    showSelectedOnly: boolean;
    maximumPermittedAmount: any;

    lockAccounts: any;

    constructor(
        public accountsService: AccountsService,
        public employeeService: EmployeeService,
        public dialog: MatDialog,
        public printService: PrintService,
        public excelService: ExcelService,
        public schoolService: SchoolService,
    ) { }

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewTransactionsServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();
        this.popoulateColumnFilter();
        this.showSelectedOnly = false;
    }

    initilizeDate(): void {
        const today = new Date();
        const sessionStartDate = new Date(this.minimumDate);
        const sessionEndDate = new Date(this.maximumDate);
        if (today >= sessionStartDate && today <= sessionEndDate) {
            this.startDate = CommonFunctions.formatDate(new Date(), '');
            this.endDate = CommonFunctions.formatDate(new Date(), '');
        }
        else {
            this.startDate = CommonFunctions.formatDate(sessionStartDate, '');
            this.endDate = CommonFunctions.formatDate(sessionEndDate, '');
        }
    }


    popoulateColumnFilter(): any {
        let columnFilter = [];
        for (let filter in this.columnFilter) {
            if (this.columnFilter[filter].displayName != undefined) {
                columnFilter.push(this.columnFilter[filter]);
            }
        }
        this.filterColumnsList = columnFilter;
    }

    getFilteredTransactionList(): any {
        let tempList = [];
        tempList = this.applyAccountFilter(this.transactionsList);
        tempList = this.applyEmployeeFilter(tempList);
        tempList = this.applyHeadFilter(tempList);
        tempList = this.applyGroupFilter(tempList);
        return tempList;
    }

    applyAccountFilter(list): any {
        let tempList = [];
        if (!this.showSelectedOnly) {
            list.forEach(transaction => {
                if (this.doesTransactionContainSelectedAccount(transaction)) {
                    tempList.push(transaction);
                }
            });
        }
        else {
            list.forEach(transaction => {
                let containAll = true;
                this.filterAccountsList.forEach(account => {
                    if (account.selected) {
                        if (transaction.debitAccounts.find(acccount => acccount.accountDbId == account.accountDbId) == undefined &&
                            transaction.creditAccounts.find(acccount => acccount.accountDbId == account.accountDbId) == undefined) {
                            containAll = false;
                        }
                    }
                });
                if (containAll) {
                    tempList.push(transaction);
                }
            });

        }
        return tempList;
    }

    applyEmployeeFilter(list): any {
        let tempList = [];
        if (this.filterEmployeeList.reduce((acc, next) => acc && next.selected, true) == true) {
            return list;
        }
        else {
            list.forEach(trans => {
                const employee = this.filterEmployeeList.find(employee => trans.parentEmployee == employee.employeeId);
                if (employee && employee.selected) {
                    tempList.push(trans);
                }
            });
        }
        return tempList;
    }

    applyHeadFilter(list: any) {
        let tempList = [];
        list.forEach(trans => {
            let containHead = false;
            trans.debitAccounts.forEach(account => {
                if (this.filterHeadsList.find(head => head.headDbId == account.parentHead).selected) {
                    containHead = true;
                }
            });
            trans.creditAccounts.forEach(account => {
                if (this.filterHeadsList.find(head => head.headDbId == account.parentHead).selected) {
                    containHead = true;
                }
            });
            if (containHead) {
                tempList.push(trans);
            }
        });
        return tempList;
    }

    applyGroupFilter(list: any) {
        let tempList = [];
        list.forEach(trans => {
            let containGroup = false;
            trans.debitAccounts.forEach(account => {
                if (account.parentGroup == null && this.filterGroupsList[0].selected) {
                    containGroup = true;
                }
                else if (account.parentGroup != null && this.filterGroupsList.find(group => group.groupDbId == account.parentGroup).selected) {
                    containGroup = true;
                }
            });
            trans.creditAccounts.forEach(account => {
                if (account.parentGroup == null && this.filterGroupsList[0].selected) {
                    containGroup = true;
                }
                else if (account.parentGroup != null && this.filterGroupsList.find(group => group.groupDbId == account.parentGroup).selected) {
                    containGroup = true;
                }
            });
            if (containGroup) {
                tempList.push(trans);
            }
        });
        return tempList;
    }

    doesTransactionContainSelectedAccount(transaction): boolean {
        for (let i = 0; i < transaction.debitAccounts.length; i++) {
            if (this.filterAccountsList.find(account => account.accountDbId == transaction.debitAccounts[i].accountDbId).selected) {
                return true;
            }
        }
        for (let i = 0; i < transaction.creditAccounts.length; i++) {
            if (this.filterAccountsList.find(account => account.accountDbId == transaction.creditAccounts[i].accountDbId).selected) {
                return true;
            }
        }
        return false;
    }

    func(a) {
        console.log(a);
    }

    openImagePreviewDialog(images: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { 'images': images, 'index': index, 'editable': editable, 'isMobile': false }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getDisplayDateFormat(str: any) {
        // return str;
        let d = new Date(str);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    canUserUpdate() {
        const module = this.user.activeSchool.moduleList.find(module => module.title === 'Accounts');
        return module.taskList.some(task => task.title === 'Update Transaction');
    }

    openUpdateTransactionDialog(transaction): void {
        this.dialog.open(UpdateTransactionDialogComponent, {
            data: { transaction: JSON.parse(JSON.stringify(transaction)), vm: this, originalTransaction: transaction }
        });
    }

    selectAll(list: any, value: any) {
        list.forEach(item => {
            item[value] = true;
        });
    }

    deSelectAll(list: any, value: any) {
        list.forEach(item => {
            item[value] = false;
        });
    }

    isAccountLocked() {
        if (this.lockAccounts) {
            return true;
        }
        else {
            return false;
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

}