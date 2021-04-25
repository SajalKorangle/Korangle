import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { SettingsServiceAdapter } from './settings.service.adapter';
import { SettingsHtmlRenderer } from './settings.html.renderer';
import { SettingsUserInput } from './settings.user.input';
import { SettingsBackendData } from './settings.backend.data';

// Services
import { ClassService } from '@services/modules/class/class.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { WeekDay } from '@angular/common';

const WEEKDAYS_LIST = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [OnlineClassService, ClassService],
})

export class SettingsComponent implements OnInit {

    user: any;

    weekdaysList = WEEKDAYS_LIST;

    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;
    userInput: SettingsUserInput;
    backendData: SettingsBackendData;

    isLoading: any;
    isAddLoading: any;

    constructor(
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new SettingsUserInput();
        this.userInput.initialize(this);

        this.backendData = new SettingsBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new SettingsHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

        console.log("this: ", this);
    }
}
