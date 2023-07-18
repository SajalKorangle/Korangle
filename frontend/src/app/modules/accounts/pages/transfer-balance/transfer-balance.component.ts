import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { GenericService } from '@services/generic/generic-service';
import { TransferBalanceServiceAdapter } from './transfer-balance.service.adapter';
import { HEADS_LIST} from '@services/modules/accounts/models/head';
import { AccountSession } from '@services/modules/accounts/models/account-session';
import { Account } from '@services/modules/accounts/models/account';
import { customAccount, customGroupStructure } from './../../classes/constants';
import {CommonFunctions} from '@classes/common-functions';

@Component({
    selector: 'transfer-balance',
    templateUrl: './transfer-balance.component.html',
    styleUrls: ['./transfer-balance.component.css'],
    providers: [
        AccountsService,
        GenericService,
    ]
})

export class TransferBalanceComponent implements OnInit{


    user: any;
    serviceAdapter: TransferBalanceServiceAdapter;
    currentSession: any;
    nextSession: any;
    isLoading: any;

    accountList: Array<Account>;
    currentSessionAccountSessionList: Array<customAccount2>;
    nextSessionAccountSessionList: Array<AccountSession>;

    currentSessionHierarchyStructure: {
        Expenses: Array<customGroupStructure>,
        Income: Array<customGroupStructure>,
        Assets: Array<customGroupStructure>,
        Liabilities: Array<customGroupStructure>,
    } = {                   // this list is responsible for the hierarchial data
        Expenses: [],
        Income: [],
        Assets: [],
        Liabilities: [],
    };
    nextSessionHierarchyStructure: {
        Expenses: Array<customGroupStructure>,
        Income: Array<customGroupStructure>,
        Assets: Array<customGroupStructure>,
        Liabilities: Array<customGroupStructure>,
    }  = {
        Expenses: [],
        Income: [],
        Assets: [],
        Liabilities: [],
    };

    headsList = HEADS_LIST;

    selectedSession: any;

    splitView: false;

    constructor(
        public accountsService: AccountsService,
        public genericService: GenericService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new TransferBalanceServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    changeAllAccountsStatusFromHead(parentHeadId, value) {
        for (let i = 0; i < this.currentSessionAccountSessionList.length; i++) {
            if (this.currentSessionAccountSessionList[i].parentHead == parentHeadId) {
                this.currentSessionAccountSessionList[i].selected = value;
            }
        }
    }

    selectAllAccounts() {
        this.changeAllAccountsStatusFromHead(1, true);
        this.changeAllAccountsStatusFromHead(2, true);
        this.changeAllAccountsStatusFromHead(3, true);
        this.changeAllAccountsStatusFromHead(4, true);
    }

    deSelectAllAccounts() {
        this.changeAllAccountsStatusFromHead(1, false);
        this.changeAllAccountsStatusFromHead(2, false);
        this.changeAllAccountsStatusFromHead(3, false);
        this.changeAllAccountsStatusFromHead(4, false);
    }

    isAnyOneAccountSelected(parentHead) {
        for (let i = 0; i < this.currentSessionAccountSessionList.length; i++) {
            if (this.currentSessionAccountSessionList[i].selected && this.currentSessionAccountSessionList[i].parentHead == parentHead.id) {
                return true;
            }
        }
        return false;
    }

    changeElementStatus(element, value) {
        const account = this.currentSessionAccountSessionList.find(account => account.parentAccount == element.parentAccount);
        account.selected = value;
    }

    toggleElementStatus(element) {
        const account = this.currentSessionAccountSessionList.find(account => account.parentAccount == element.parentAccount);
        account.selected = !account.selected;
        this.selectParentGroups(element, account.selected);
        if (element.type == 'GROUP') {
            this.changeChildStatus(element, account.selected);
        }
    }

    isElementSelected(element) {
        return this.currentSessionAccountSessionList.find(account => account.parentAccount == element.parentAccount).selected;
    }

    isElementDisabled(element) {
        return this.currentSessionAccountSessionList.find(account => account.parentAccount == element.parentAccount).disabled;
    }

    selectParentGroups(element, value) { // check here
        if (value == true) {
            while (element.parentGroup != null) {
                let account = this.currentSessionAccountSessionList.find(account => account.parentAccount == element.parentGroup);
                account.selected = value;
                element =  account;
            }
        }
    }

    changeChildStatus(element, value) {
        this.currentSessionAccountSessionList.forEach(ele => {
            if (ele.parentGroup == element.parentAccount) {
                ele.selected = value;
                if (ele.type == 'GROUP') {
                    this.changeChildStatus(ele, value);
                }
            }
        });
    }

    countSelectedGroups() {
        let count = 0;
        this.currentSessionAccountSessionList.forEach(account => {
            if (account.type == "GROUP" && account.selected == true) {
                count = count + 1;
            }
        });
        return count;
    }

    countTotalGroups() {
        let count = 0;
        this.currentSessionAccountSessionList.forEach(account => {
            if (account.type == "GROUP") {
                count = count + 1;
            }
        });
        return count;
    }

    countSelectedAccounts() {
        let count = 0;
        this.currentSessionAccountSessionList.forEach(account => {
            if (account.type == "ACCOUNT" && account.selected == true) {
                count = count + 1;
            }
        });
        return count;
    }

    countTotalAccounts() {
        let count = 0;
        this.currentSessionAccountSessionList.forEach(account => {
            if (account.type == "ACCOUNT") {
                count = count + 1;
            }
        });
        return count;
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}


interface customAccount2 extends customAccount{
    selected?: boolean;
    disabled?: boolean;
}
