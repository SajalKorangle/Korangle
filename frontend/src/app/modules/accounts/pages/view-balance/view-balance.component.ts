import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
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
import { CommonFunctions } from './../../../../classes/common-functions';
import xlsx = require('xlsx');

@Component({
  selector: 'view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.css'],
  providers: [
    AccountsService,
    SchoolService,
    EmployeeService,
  ]
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
    Expenses: Array<customGroupStructure>,
    Income: Array<customGroupStructure>,
    Assets: Array<customGroupStructure>,
    Liabilities: Array<customGroupStructure>,

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
      displayName: string,
      value: boolean,
    },
    date: {
      displayName: string,
      value: boolean,
    },
    accounts: {
      displayName: string,
      value: boolean,
    };
    debitAmount: {
      displayName: string,
      value: boolean,
    },
    creditAmount: {
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
    },
    balance: {
      displayName: string,
      value: boolean,
    };
  } = {
      voucherNumber: {
        displayName: 'V. No.',
        value: true,
      },
      date: {
        displayName: 'Date',
        value: true,
      },
      accounts: {
        displayName: 'Accounts',
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
        displayName: 'Quotation',
        value: false,
      },
      bill: {
        displayName: 'Bill',
        value: false,
      },
      balance: {
        displayName: 'Balance',
        value: true,
      }
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
    this.serviceAdapter = new ViewBalanceServiceAdapter;
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
    }
    else {
      this.searchList = this.getAccountListFromString(str);
    }
  }

  getAccountListFromString(str: any) {
    let temp = [];
    this.accountsList.forEach(account => {
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
    const module = this.user.activeSchool.moduleList.find(module => module.title === 'Accounts');
    return module.taskList.some(task => task.title === 'Update Transaction');
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
      data: { 'images': images, 'index': index, 'editable': editable, 'isMobile': false }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
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
    }
    else {
      return false;
    }
  }

  getHeadBalance(headTitle): number {
    const headChilds: Array<customGroupStructure> = Object.values(this.hierarchyStructure[headTitle]);
    return headChilds.reduce((accumulator: number, nextEntry: customGroupStructure): number => accumulator + nextEntry.currentBalance, 0);
  }

  downloadAsSheet(): void {

    const excel2DTabel = [];
    const headerRow = [];

    if (this.columnFilter.voucherNumber.value) {
      headerRow.push(this.columnFilter.voucherNumber.displayName);
    }
    if (this.columnFilter.date.value) {
      headerRow.push(this.columnFilter.date.displayName);
    }
    if (this.columnFilter.accounts.value) {
      headerRow.push(this.columnFilter.accounts.displayName);
    }
    if (this.columnFilter.debitAmount.value) {
      headerRow.push(this.columnFilter.debitAmount.displayName);
    }
    if (this.columnFilter.creditAmount.value) {
      headerRow.push(this.columnFilter.creditAmount.displayName);
    }
    if (this.columnFilter.remark.value) {
      headerRow.push(this.columnFilter.remark.displayName);
    }
    if (this.columnFilter.approvalId.value) {
      headerRow.push(this.columnFilter.approvalId.displayName);
    }
    if (this.columnFilter.addedBy.value) {
      headerRow.push(this.columnFilter.addedBy.displayName);
    }
    if (this.columnFilter.balance.value) {
      headerRow.push(this.columnFilter.balance.displayName);
    }
    excel2DTabel.push(headerRow);

    this.transactionsList.forEach(transaction => {
      const row = [];
      if (this.columnFilter.voucherNumber.value) {
        row.push(transaction.voucherNumber);
      }
      if (this.columnFilter.date.value) {
        row.push(this.getDisplayDateFormat(transaction.transactionDate));
      }
      if (this.columnFilter.accounts.value) {
        row.push(transaction.accounts.reduce((acc, nextAcc) => acc + nextAcc.accountTitle + '\n', '').trim());
      }
      if (this.columnFilter.debitAmount.value) {
        row.push(transaction.accounts.filter(acc => acc.type == 'DEBIT').reduce((acc, nextAcc) => acc + nextAcc.amount + '\n', '').trim());
      }
      if (this.columnFilter.creditAmount.value) {
        row.push(transaction.accounts.filter(acc => acc.type == 'CREDIT').reduce((acc, nextAcc) => acc + nextAcc.amount + '\n', '').trim());
      }
      if (this.columnFilter.remark.value) {
        row.push(transaction.remark);
      }
      if (this.columnFilter.approvalId.value) {
        row.push(transaction.approvalId);
      }
      if (this.columnFilter.addedBy.value) {
        row.push(transaction.parentEmployeeName);
      }
      if (this.columnFilter.balance.value) {
        row.push(transaction.balance);
      }
      excel2DTabel.push(row);
    });

    let ws = xlsx.utils.aoa_to_sheet(excel2DTabel);
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, this.ledgerAccount.title + '.xlsx');
  }

  isMobile(): boolean {
    return CommonFunctions.getInstance().isMobileMenu();
  }

}
