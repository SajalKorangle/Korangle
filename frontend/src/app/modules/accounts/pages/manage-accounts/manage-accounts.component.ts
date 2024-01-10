import { Component } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { MatDialog, } from '@angular/material';
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component';
import { EditAccountDialogComponent } from './edit-account-dialog/edit-account-dialog.component';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { ManageAccountsServiceAdapter } from './manage-accounts.service.adapter';
import { ManageAccountsBackendData } from './manage-accounts.backend.data';
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { GenericService } from '@services/generic/generic-service';
import { HEADS_LIST } from '@services/modules/accounts/models/head';
import { customAccount, customGroupStructure } from './../../classes/constants';

@Component({
    selector: 'manage-accounts',
    templateUrl: './manage-accounts.component.html',
    styleUrls: ['./manage-accounts.component.css'],
    providers: [
        AccountsService,
        GenericService,
    ]
})

export class ManageAccountsComponent {

    user: any;
    serviceAdapter: ManageAccountsServiceAdapter;
    backendData: ManageAccountsBackendData;

    accountsList: Array<customAccount>;
    groupsList: Array<customAccount>;
    headsList = HEADS_LIST;
    isLoading: any;


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

    lockAccounts: boolean = false;

    searchList: Array<customAccount> = [];

    listView: boolean = true;

    constructor(
        public dialog: MatDialog,
        public accountsService: AccountsService,
        public genericService: GenericService,
    ) { }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.backendData = new ManageAccountsBackendData();
        this.backendData.initialize(this);
        this.serviceAdapter = new ManageAccountsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.displayWholeList = true;
        // console.log('this: ', this);
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

    openAddAccountDialog() {
        const dialogRef = this.dialog.open(AddAccountDialogComponent, {
            width: '300px',
            data: {
                vm: this,
            }
        });

        dialogRef.afterClosed();
    }

    openAddGroupDialog() {
        const dialogRef = this.dialog.open(AddGroupDialogComponent, {
            width: '300px',
            data: {
                vm: this,
            }
        });

        dialogRef.afterClosed();
    }

    openEditDialog(element) {
        if (element.type == 'ACCOUNT') {
            const dialogRef = this.dialog.open(EditAccountDialogComponent, {
                width: '300px',
                data: {
                    vm: this,
                    account: JSON.parse(JSON.stringify(element)),
                }
            });

            dialogRef.afterClosed();
        }
        else {
            const dialogRef = this.dialog.open(EditGroupDialogComponent, {
                width: '300px',
                data: {
                    vm: this,
                    group: JSON.parse(JSON.stringify(element)),
                }
            });

            dialogRef.afterClosed();
        }
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
            if (account.title.toLowerCase().includes(str.toLowerCase())) {
                temp.push(account);
            }
        });
        return temp;
    }

    displayWholeGroup(group: any) {
        this.displayWholeList = false;
        this.specificGroup = group;
    }

}