import { Component, OnInit } from '@angular/core';

import { SchoolService } from '../../../../services/modules/school/school.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { DataStorage } from '../../../../classes/data-storage';
import { SettingsServiceAdapter } from './settings.service.adapter';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [SchoolService, UserService, HomeworkService],
})
export class SettingsComponent {
    user: any;
    sentUpdateList = ['NULL', 'SMS', 'NOTIFICATION', 'NOTIF./SMS'];

    sentUpdateType: any;

    sendCreateUpdate: any;
    sendEditUpdate: any;
    sendDeleteUpdate: any;
    sendCheckUpdate: any;
    sendResubmissionUpdate: any;
    previousSettings: any;

    isLoading = true;

    settingsChanged: any;

    serviceAdapter: SettingsServiceAdapter;

    constructor(public schoolService: SchoolService, public userService: UserService, public homeworkService: HomeworkService) {}

    ngOnInit(): void {
        this.serviceAdapter = new SettingsServiceAdapter();
        this.settingsChanged = false;
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    checkChangeSettings(): any {
        if (
            this.sentUpdateType == this.previousSettings.sentUpdateType &&
            this.sendCreateUpdate == this.previousSettings.sendCreateUpdate &&
            this.sendDeleteUpdate == this.previousSettings.sendDeleteUpdate &&
            this.sendEditUpdate == this.previousSettings.sendEditUpdate &&
            this.sendCheckUpdate == this.previousSettings.sendCheckUpdate &&
            this.sendResubmissionUpdate == this.previousSettings.sendResubmissionUpdate
        ) {
            this.settingsChanged = false;
        } else {
            this.settingsChanged = true;
        }
    }
}
