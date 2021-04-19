import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { SettingsServiceAdapter } from './settings.service.adapter';
import { SESSION_CONSTANT } from './../../../../services/modules/school/models/session';

import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { SchoolService } from './../../../../services/modules/school/school.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [AccountsService, SchoolService],
})
export class SettingsComponent {
    user: any;

    selectedEmployeeAmount: any;
    selectedEmployee: any;
    selectedEmployeeAccountPermission: any;

    currentSession: any;

    lockAccounts: any;

    serviceAdapter: SettingsServiceAdapter;
    isLoading: boolean;

    constructor(public accountsService: AccountsService, public schoolService: SchoolService) {}
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.selectedEmployee = null;
        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.currentSession = SESSION_CONSTANT.find((session) => session.id == this.user.activeSchool.currentSessionDbId);
    }
}
