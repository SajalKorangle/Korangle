import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { SettingsServiceAdapter } from './settings.service.adapter'
 
@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [
        AccountsService,
    ],
})

export class SettingsComponent{

    // @Input() user;
    user: any;
    serviceAdapter: any;
    isLoading: boolean;

    selectedEmployeeAmount : any;
    selectedEmployee: any;
    
    isUpdating: any;
    
    constructor( 
        public accountsService: AccountsService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.selectedEmployee = null;
        this.serviceAdapter = new SettingsServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }


    
} 