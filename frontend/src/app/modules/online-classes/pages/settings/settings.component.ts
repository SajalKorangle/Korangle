import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
import { WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME } from '@modules/online-classes/class/constants';


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

    weekdays = WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME;

    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;
    userInput: SettingsUserInput;
    backendData: SettingsBackendData;


    isLoading: boolean;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
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

    hasAdminPermission() {
        if (this.backendData.employeePermission.configJSON[USER_PERMISSION_KEY] == TEACHER_PERMISSION) {
            return false;
        }
        return true;
    }

}
