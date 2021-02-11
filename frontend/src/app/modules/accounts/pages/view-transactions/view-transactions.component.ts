import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { EmployeeService } from './../../../../services/modules/employee/employee.service'
import { ViewTransactionsServiceAdapter } from './view-transactions.service.adapter'
import { CommonFunctions } from './../../../../classes/common-functions'
import { element } from 'protractor';


@Component({
  selector: 'view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css'],
  providers: [
    AccountsService,
    EmployeeService,
  ]
})

export class ViewTransactionsComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: ViewTransactionsServiceAdapter;

    
    constructor( 
      public accountsService: AccountsService,
      public employeeService: EmployeeService,
    ){ }

    isLoading: any;
    loadMoreTransactions: any;
    loadingCount = 15;

    startDate = CommonFunctions.formatDate(new Date(), '');
    endDate = CommonFunctions.formatDate(new Date, '');

    columnFilter : {
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
      },
      update: {},
      delete: {},
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
        value: true,
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
      },
      update: false,
      delete: false,
    }
    

    transactionsList: any;
    employeeList = [];
    accountsList: any;

    filterColumnsList: any;
    filterAccountsList: any;
    filterEmployeeList: any;

    isInitialLoading: any;

    showSelectedOnly: boolean;

    // Server Handling - Initial
    ngOnInit(): void {
      this.user = DataStorage.getInstance().getUser();
      this.serviceAdapter = new ViewTransactionsServiceAdapter;
      this.serviceAdapter.initialiseAdapter(this);
      this.serviceAdapter.initialiseData();
      this.popoulateColumnFilter();
      this.showSelectedOnly = false;
    }

    popoulateColumnFilter(): any{
      let columnFilter = [];
      for(let filter in this.columnFilter){
        if(this.columnFilter[filter].displayName != undefined){
          columnFilter.push(this.columnFilter[filter]);
        }
      }
      this.filterColumnsList = columnFilter;
    }

    getFilteredTransactionList(): any{
      let tempList = [];
      tempList = this.applyAccountFilter(this.transactionsList);
      tempList = this.applyEmployeeFilter(tempList);
      return tempList;
    }

    applyAccountFilter(list): any{
      let tempList = [];
      if(!this.showSelectedOnly){
        list.forEach(transaction =>{
          if(this.doesTransactionContainSelectedAccount(transaction)){
            tempList.push(transaction);
          }
        })
      }
      else{
        list.forEach(transaction =>{
          let containAll = true;
          this.filterAccountsList.forEach(account =>{
            if(account.selected){
              if(transaction.debitAccounts.find(acccount => acccount.accountDbId == account.accountDbId) == undefined && 
              transaction.creditAccounts.find(acccount => acccount.accountDbId == account.accountDbId) == undefined){
                containAll = false;
              }
            }
          })
          if(containAll){
            tempList.push(transaction);
          }
        })
          
      }
      return tempList;
    }

    applyEmployeeFilter(list): any{
      let tempList = [];
      list.forEach(trans =>{
        if(this.filterEmployeeList.find(employee => trans.parentEmployee == employee.employeeId).selected){
          tempList.push(trans);
        }
      })
      return tempList;
    }

    doesTransactionContainSelectedAccount(transaction): boolean{
      for(let i=0;i<transaction.debitAccounts.length; i++){
        if(this.filterAccountsList.find(account => account.accountDbId == transaction.debitAccounts[i].accountDbId).selected){
          return true;
        }
      }
      for(let i=0;i<transaction.creditAccounts.length; i++){
        if(this.filterAccountsList.find(account => account.accountDbId == transaction.creditAccounts[i].accountDbId).selected){
          return true;
        }
      }
      return false;
    }
}