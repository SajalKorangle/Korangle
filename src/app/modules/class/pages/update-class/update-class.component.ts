import { Component, OnInit } from '@angular/core';

import { UpdateClassServiceAdapter } from './update-class.service.adapter';

import { ChangeDetectorRef } from '@angular/core';

import { DataStorage } from "../../../../classes/data-storage";
import {ClassService} from "../../../../services/modules/class/class.service";
import {StudentService} from "../../../../services/modules/student/student.service";

@Component({
    selector: 'update-class',
    templateUrl: './update-class.component.html',
    styleUrls: ['./update-class.component.css'],
    providers: [ ClassService, StudentService ],
})

export class UpdateClassComponent implements OnInit {

    user;

    classSectionList = [];
    selectedClassSection: any;
    classTeacherSignature: any;

    serviceAdapter: UpdateClassServiceAdapter;

    showSignature = false;
    isInitialLoading = false;
    isLoading = false;
    timeout: any;

    constructor(public classOldService: ClassService,
                public studentService: StudentService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UpdateClassServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
