import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { StudentPermissionServiceAdapter } from './student-permission.service.adapter';
import { StudentPermissionHtmlRenderer } from './student-permission.html.renderer';
import { StudentPermissionUserInput } from './student-permission.user.input';
import { StudentPermissionBackendData } from './student-permission.backend.data';

@Component({
    selector: 'student-permission',
    templateUrl: './student-permission.component.html',
    styleUrls: ['./student-permission.component.css'],
    providers: [ ],
})

export class StudentPermissionComponent implements OnInit {

    user: any;

    serviceAdapter: StudentPermissionServiceAdapter;
    htmlRenderer: StudentPermissionHtmlRenderer;
    userInput: StudentPermissionUserInput;
    backendData: StudentPermissionBackendData;

    isLoading: any;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new StudentPermissionUserInput();
        this.userInput.initialize(this);

        this.backendData = new StudentPermissionBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new StudentPermissionHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new StudentPermissionServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
