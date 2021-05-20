import {Component, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {RECEIVER_LIST} from '@modules/attendance/classes/constants';
import {SettingsServiceAdapter} from '@modules/attendance/pages/settings/settings.service.adapter';
import {SettingsHtmlRenderer} from '@modules/attendance/pages/settings/settings.html.renderer';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    providers: [],
})
export class SettingsComponent {
    user: any;

    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;

    receiverList = RECEIVER_LIST;

    stateKeeper = {
        isLoading: false,
    };
    
    attendanceVariables = ['attendanceStatus', 'attendanceDate'];

    attendanceEvents = [{
        name: 'Attendance Creation'
    }, {
        name: 'Attendance Updation'
    }];

    constructor() {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.htmlRenderer = new SettingsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }
}
