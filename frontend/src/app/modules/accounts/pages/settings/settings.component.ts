import { Component } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { SettingsServiceAdapter } from './settings.service.adapter';
import { SettingsBackendData } from './settings.backend.data';

import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { SchoolService } from './../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';

import { CommonFunctions } from './../../../../classes/common-functions';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [
        AccountsService,
        SchoolService,
        GenericService,
    ],
})

export class SettingsComponent {

    user: any;

    selectedEmployeeAmount: any;
    selectedEmployee: any;
    selectedEmployeeAccountPermission: any;

    currentSession: any;

    lockAccounts: any;

    serviceAdapter: SettingsServiceAdapter;
    backendData: SettingsBackendData;
    isLoading: boolean;

    scrollToTop = CommonFunctions.scrollToTop;

    constructor(
        public accountsService: AccountsService,
        public schoolService: SchoolService,
        public genericService: GenericService,
    ) { }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.selectedEmployee = null;
        this.serviceAdapter = new SettingsServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.backendData = new SettingsBackendData();
    }

    handleEmployeeSelection(employee: any): void {
        this.selectedEmployee = employee;
        this.selectedEmployeeAccountPermission = this.backendData.getEmployeePermission(employee);
        if (this.selectedEmployeeAccountPermission) {
            this.selectedEmployeeAmount = this.selectedEmployeeAccountPermission.restrictedAmount;
        }
        else {
            this.selectedEmployeeAmount = 0;
        }
    }

}