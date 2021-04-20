import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { MatDialog } from '@angular/material';
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { SchoolService } from './../../../../services/modules/school/school.service';
import { ViewBalanceServiceAdapter } from './view-balance.service.adapter';
import { EmployeeService } from './../../../../services/modules/employee/employee.service';
import { UpdateTransactionDialogComponent } from './../../components/update-transaction-dialog/update-transaction-dialog.component';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component';
import { PrintService } from '../../../../print/print-service';
import { PRINT_LEDGER } from './../../../../print/print-routes.constants';
import { HEADS_LIST } from '@services/modules/accounts/models/head';
import { customAccount, customGroupStructure } from './../../classes/constants';

@Component({
    selector: 'view-balance',
    templateUrl: './view-balance.component.html',
    styleUrls: ['./view-balance.component.css'],
    providers: [AccountsService, SchoolService, EmployeeService],
})
export class ViewBalanceComponent implements OnInit {
    user: any;
    serviceAdapter: ViewBalanceServiceAdapter;

    accountsList: Array<customAccount>;
    groupsList: Array<customAccount>;
    headsList = HEADS_LIST;
    isLoading: any;

    displayLedger: any;
    ledgerAccount: any;
    isLedgerLoading: any;

    hierarchyStructure: {
        Expenses: Array<customGroupStructure>;
        Income: Array<customGroupStructure>;
        Assets: Array<customGroupStructure>;
        Liabilities: Array<customGroupStructure>;
    } = {
            Expenses: [],
            Income: [],
            Assets: [],
            Liabilities: [],
        };
    displayWholeList: boolean;

    minimumDate: any;
    maximumDate: any;
    specificGroup: any;

    searchList = [];

    columnFilter: {
        voucherNumber: {
            displayName: string;
            value: boolean;
        };
        date: {
            displayName: string;
            value: boolean;
        };
        accounts: {
            displayName: string;
            value: boolean;
        };
        debitAmount: {
            displayName: string;
            value: boolean;
        };
        creditAmount: {
            displayName: string;
            value: boolean;
        };
        remark: {
            displayName: string;
            value: boolean;
        };
        approvalId: {
            displayName: string;
            value: boolean;
        };
        addedBy: {
            displayName: string;
            value: boolean;
        };
        quotation: {
            displayName: string;
            value: boolean;
        };
        bill: {
            displayName: string;
            value: boolean;
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
            accounts: {
                displayName: 'Account',
                value: true,
            },
            debitAmount: {
                displayName: 'Debit Amount',
                value: true,
            },
            creditAmount: {
                displayName: 'Credit Amount',
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
                value: false,
            },
            quotation: {
                displayName: 'Quotations',
                value: false,
            },
            bill: {
                displayName: 'Bills',
                value: false,
            },
        };
    filterColumnsList: any;
    transactionsList: any;
    employeeList: any;

    lockAccounts: any;

    listView: boolean = true;

    constructor(
        public dialog: MatDialog,
        public accountsService: AccountsService,
        public schoolService: SchoolService,
        public employeeService: EmployeeService,
        public printService: PrintService,
    ) { }

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewBalanceServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.popoulateColumnFilter();
        this.displayWholeList = true;
        this.displayLedger = false;
    }

    getHeadName(id: number) {
        return this.headsList.find(h => h.id == id).title;
    }

    getGroupName(id: number) {
        const group = this.groupsList.find(g => g.id == id);
        if (group)
            return group.title;
        else
            return null;
    }

    handleSearch(event: any) {
        let str = event.target.value.trim();
        if (str.length == 0) {
            this.searchList = [];
        } else {
            this.searchList = this.getAccountListFromString(str);
        }
    }

    getAccountListFromString(str: any) {
        let temp = [];
        this.accountsList.forEach((account) => {
            if (account.title.includes(str)) {
                temp.push(account);
            }
        });
        return temp;
    }

    displayWholeGroup(group: any) {
        this.displayWholeList = false;
        this.specificGroup = group;
    }

    canUserUpdate() {
        const module = this.user.activeSchool.moduleList.find((module) => module.title === 'Accounts');
        return module.taskList.some((task) => task.title === 'Update Transaction');
    }

    displayLedgerAccount(element) {
        this.isLedgerLoading = true;
        if (element.type == 'GROUP') {
            return;
        }
        this.displayLedger = true;
        this.ledgerAccount = element;
        this.serviceAdapter.loadTransactions();
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

    openImagePreviewDialog(images: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { images: images, index: index, editable: editable, isMobile: false },
        });

        dialogRef.afterClosed().subscribe((result) => { });
    }

    openUpdateTransactionDialog(transaction): void {
        this.dialog.open(UpdateTransactionDialogComponent, {
            data: { transaction: JSON.parse(JSON.stringify(transaction)), vm: this, originalTransaction: transaction }
        });
    }

    printTransactionsList() {
        let value = {
            transactionsList: this.transactionsList,
            account: this.ledgerAccount,
            columnFilter: this.columnFilter,
        };
        this.printService.navigateToPrintRoute(PRINT_LEDGER, { user: this.user, value });
    }

    isAccountLocked() {
        if (this.lockAccounts) {
            return true;
        } else {
            return false;
        }
    }

    getHeadBalance(headTitle): number {
        const headChilds: Array<customGroupStructure> = Object.values(this.hierarchyStructure[headTitle]);
        return headChilds.reduce((accumulator: number, nextEntry: customGroupStructure): number => accumulator + nextEntry.currentBalance, 0);
    }

}
