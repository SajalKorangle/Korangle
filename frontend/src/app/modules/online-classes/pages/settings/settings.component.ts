import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataStorage } from "@classes/data-storage";

import { SettingsServiceAdapter } from './settings.service.adapter';
import { SettingsHtmlRenderer } from './settings.html.renderer';
import { SettingsUserInput } from './settings.user.input';
import { SettingsBackendData } from './settings.backend.data';

import { USER_PERMISSION_KEY, TEACHER_PERMISSION } from './settings.permissions';

// Services
import { ClassService } from '@services/modules/class/class.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { EmployeeService } from '@services/modules/employee/employee.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import { WEEKDAYS, Time } from '@modules/online-classes/class/constants';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [
        MatDialog,
        OnlineClassService,
        ClassService,
        EmployeeService,
        SubjectService
    ],
})

export class SettingsComponent implements OnInit {

    user: any;

    weekdays = WEEKDAYS;

    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;
    userInput: SettingsUserInput;
    backendData: SettingsBackendData;
    filteredSubjectList:any;

    view: 'class' | 'employee' = 'class';

    isLoading: boolean;

    constructor(
        public dialog: MatDialog,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public employeeService: EmployeeService,
        public subjectService: SubjectService,
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

    parseBacknedData() {
        this.backendData.onlineClassList.forEach(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
        });
    }

    getObjetKeys(obj: { [key: string]: any; }): Array<string> {
        return Object.keys(obj);
    }

    hasAdminPermission() {
        if (this.backendData.employeePermission.configJSON[USER_PERMISSION_KEY] == TEACHER_PERMISSION) {
            return false;
        }
        return true;
    }

}
