import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { SettingsServiceAdapter } from './settings.service.adapter'
import { SchoolService } from './../../../../services/modules/school/school.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [
        AccountsService,
        SchoolService,
    ],
})

export class SettingsComponent{

    // @Input() user;
    user: any;
    serviceAdapter: SettingsServiceAdapter;
    isLoading: boolean;

    selectedEmployeeAmount : any;
    selectedEmployee: any;
    
    minimumDate: any;
    maximumDate: any;

    lockAccounts: any;
    
    constructor( 
        public accountsService: AccountsService,
        public schoolService: SchoolService,
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