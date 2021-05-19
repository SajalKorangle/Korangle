import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { StudentPermissionServiceAdapter } from './student-permission.service.adapter';
import { StudentPermissionHtmlRenderer } from './student-permission.html.renderer';
import { StudentPermissionUserInput } from './student-permission.user.input';
import { StudentPermissionBackendData } from './student-permission.backend.data';

import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { Classs } from '@services/modules/class/models/classs';

@Component({
    selector: 'student-permission',
    templateUrl: './student-permission.component.html',
    styleUrls: ['./student-permission.component.css'],
    providers: [
        StudentService,
        ClassService
     ],
})

export class StudentPermissionComponent implements OnInit {

    user: any;

    serviceAdapter: StudentPermissionServiceAdapter;
    htmlRenderer: StudentPermissionHtmlRenderer;
    userInput: StudentPermissionUserInput;
    backendData: StudentPermissionBackendData;

    isLoading: any;

    constructor (
        public studentService: StudentService,
        public classService: ClassService,
    ) { }

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
        this.serviceAdapter.initilizeData();
    }
}
