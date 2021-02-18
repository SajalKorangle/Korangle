import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component'
import { EditAccountDialogComponent } from './edit-account-dialog/edit-account-dialog.component'   
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component'
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component'
import { ManageAccountsServiceAdapter } from './manage-accounts.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { SchoolService } from './../../../../services/modules/school/school.service'

 
@Component({
    selector: 'manage-accounts',
    templateUrl: './manage-accounts.component.html',
    styleUrls: ['./manage-accounts.component.css'],
    providers: [
        AccountsService,
        SchoolService,
    ]
})

export class ManageAccountsComponent{

    user: any;
    serviceAdapter: ManageAccountsServiceAdapter;

    accountsList: any;
    groupsList: any;
    headsList: any;
    isLoading: any;
    constructor( 
        public dialog: MatDialog,
        public accountsService: AccountsService,
        public schoolService: SchoolService,
    ){ }


    expensesList = [];
    assetsList = [];
    liabilityList = [];
    incomeList = [];
    displayWholeList: boolean;

    minimumDate: any;
    maximumDate: any;
    specificGroup: any;

    searchList = [];
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageAccountsServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.displayWholeList = true;
    }



    openAddAccountDialog(){
        const dialogRef = this.dialog.open(AddAccountDialogComponent, {
            width: '300px',
            data: {
                vm: this,
            }
        });
    
        dialogRef.afterClosed();
    }

    openAddGroupDialog(){
        const dialogRef = this.dialog.open(AddGroupDialogComponent, {
            width: '300px',
            data: {
                vm: this,
            }
        });
    
        dialogRef.afterClosed();
    }

    openEditDialog(element){
        if(element.type == 'ACCOUNT'){
            const dialogRef = this.dialog.open(EditAccountDialogComponent, {
                width: '300px',
                data: {
                    vm: this,
                    account: JSON.parse(JSON.stringify(element)),
                }
            });
        
            dialogRef.afterClosed();
        }
        else{
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

    handleSearch(event: any){
        console.log(event.target.value);
        let str = event.target.value.trim();
        if(str.length == 0){
            this.searchList = [];
        }
        else{
            this.searchList = this.getAccountListFromString(str);
        }
        console.log(this.searchList);
    }

    getAccountListFromString(str: any){
        let temp = [];
        this.accountsList.forEach(account =>{
            if(account.title.includes(str)){
                temp.push(account);
            }
        })
        this.groupsList.forEach(group =>{
            if(group.title.includes(str)){
                temp.push(group);
            }
        })
        return temp;
    }

    displayWholeGroup(group: any){
        console.log(group);
        this.displayWholeList = false;
        this.specificGroup = group;
    }
    
} 