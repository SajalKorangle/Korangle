import { Component, OnInit } from '@angular/core';

import { SettingsServiceAdapter } from './settings.service.adapter';
import { TutorialsService } from '../../../../services/modules/tutorials/tutorials.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [TutorialsService],
})
export class SettingsComponent implements OnInit {
    serviceAdapter: SettingsServiceAdapter;
    user: any;
    isLoading: any;

    sentUpdateList = ['NULL', 'SMS', 'NOTIFICATION', 'NOTIF./SMS'];

    sentUpdateType: any;
    sendCreateUpdate: any;
    sendEditUpdate: any;
    sendDeleteUpdate: any;

    previousSettings: any;

    constructor(public tutorialService: TutorialsService) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getSentUpdateTypeIndex(sentType: any) {
        if (sentType == 'NULL') {
            return 0;
        }
        if (sentType == 'SMS') {
            return 1;
        }
        if (sentType == 'NOTIFICATION') {
            return 2;
        }
        if (sentType == 'NOTIF./SMS') {
            return 3;
        }
    }

    isSettingsChanged(): boolean {
        return !(
            this.previousSettings.sentUpdateType == this.getSentUpdateTypeIndex(this.sentUpdateType) + 1 &&
            this.previousSettings.sendCreateUpdate == this.sendCreateUpdate &&
            this.previousSettings.sendEditUpdate == this.sendEditUpdate &&
            this.previousSettings.sendDeleteUpdate == this.sendDeleteUpdate
        );
    }
}
