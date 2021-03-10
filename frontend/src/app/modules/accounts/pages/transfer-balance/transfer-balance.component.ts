import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { SchoolService } from './../../../../services/modules/school/school.service'
import { EmployeeService } from './../../../../services/modules/employee/employee.service'
import { TransferBalanceServiceAdapter } from './transfer-balance.service.adapter'
import { HEADS_LIST } from './../../classes/constants'

 
@Component({
    selector: 'transfer-balance',
    templateUrl: './transfer-balance.component.html',
    styleUrls: ['./transfer-balance.component.css'],
    providers: [
        AccountsService,
        SchoolService,
        EmployeeService,
    ]
})

export class TransferBalanceComponent{


    user: any;
    serviceAdapter: TransferBalanceServiceAdapter;
    currentSession: any;
    nextSession: any;
    isLoading: any;

    currentSessionAccountsList = {                   // this list is responsible for the hierarchial data
        Expenses: [],
        Income: [],
        Assets: [],
        Liabilities: [],
    };
    nextSessionAccountsList = {
        Expenses: [],
        Income: [],
        Assets: [],
        Liabilities: [],
    }
    headsList = HEADS_LIST;

    currentSessionSelectedAccountsList = [];         // this list is responsible for keeping track of selected and disabled accounts as well as groups

    selectedSession: any;

    splitView:false;
        
    constructor( 
        public accountsService: AccountsService,
        public schoolService: SchoolService,
        public employeeService: EmployeeService,
    ){ }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new TransferBalanceServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    changeAllAccountsStatusFromHead(parentHead, value){
        for(let i=0;i<this.currentSessionSelectedAccountsList.length; i++){
            if(this.currentSessionSelectedAccountsList[i].parentHead == parentHead){
                this.currentSessionSelectedAccountsList[i].selected = value;
            }
        }
    }

    selectAllAccounts(){
        this.changeAllAccountsStatusFromHead(1, true);
        this.changeAllAccountsStatusFromHead(2, true)
        this.changeAllAccountsStatusFromHead(3, true)
        this.changeAllAccountsStatusFromHead(4, true)
    }

    deSelectAllAccounts(){
        this.changeAllAccountsStatusFromHead(1, false);
        this.changeAllAccountsStatusFromHead(2, false);
        this.changeAllAccountsStatusFromHead(3, false);
        this.changeAllAccountsStatusFromHead(4, false);
    }

    isAnyOneAccountSelected(parentHead){
        for(let i=0;i<this.currentSessionSelectedAccountsList.length; i++){
            if(this.currentSessionSelectedAccountsList[i].selected && this.currentSessionSelectedAccountsList[i].parentHead == parentHead){
                return true;
            }
        }
        return false;
    }

    changeElementStatus(element, value){
        let account = this.currentSessionSelectedAccountsList.find(account => account.parentAccount == element.parentAccount);
        account.selected = value;
    }

    isElementSelected(element){
        return this.currentSessionSelectedAccountsList.find(account => account.parentAccount == element.parentAccount).selected;
    }

    isElementDisabled(element){
        // console.log(this.currentSessionSelectedAccountsList.find(account => account.parentAccount == element.parentAccount).disabled);
        return this.currentSessionSelectedAccountsList.find(account => account.parentAccount == element.parentAccount).disabled;
    }

    selectParentGroups(element, value){
        if(value == true){
            while(element.parentGroup != null){
                let account = this.currentSessionSelectedAccountsList.find(account => account.parentAccount == element.parentGroup);
                account.selected = value;
                element =  account;
            }
        }
    }

    changeChildStatus(element, value){
        this.currentSessionSelectedAccountsList.forEach(ele => {
            if(ele.parentGroup == element.parentAccount){
                ele.selected = value;
                if(ele.type == 'GROUP'){
                    this.changeChildStatus(ele, value);
                }
            }
        })
    }

    countSelectedGroups(){
        let count = 0;
        this.currentSessionSelectedAccountsList.forEach(account=>{
            if (account.type=="GROUP" && account.selected ==true){
                count=count+1
            }
        })
        return count;
    }

    countTotalGroups(){
        let count = 0;
        this.currentSessionSelectedAccountsList.forEach(account=>{
            if (account.type=="GROUP"){
                count=count+1
            }
        })
        return count;
    }

    countSelectedAccounts(){
        let count = 0;
        this.currentSessionSelectedAccountsList.forEach(account=>{
            if (account.type=="ACCOUNT" && account.selected ==true){
                count=count+1
            }
        })
        return count;
    }

    countTotalAccounts(){
        let count = 0;
        this.currentSessionSelectedAccountsList.forEach(account=>{
            if (account.type=="ACCOUNT"){
                count=count+1
            }
        })
        return count;
    }


} 