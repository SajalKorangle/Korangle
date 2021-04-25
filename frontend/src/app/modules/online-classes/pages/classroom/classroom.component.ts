import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomUserInput } from './classroom.user.input';
import { ClassroomBackendData } from './classroom.backend.data';

import { SubjectService } from '@services/modules/subject/subject.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';

import { WEEKDAYS } from '@modules/online-classes/class/constants';

@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [SubjectService, OnlineClassService, ClassService],
})

export class ClassroomComponent implements OnInit {

    user: any;

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    userInput: ClassroomUserInput;
    backendData: ClassroomBackendData;

    mettingParameters: any = {};

    weekdays = WEEKDAYS;

    isLoading: any;

    constructor(
        public subjectService: SubjectService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new ClassroomUserInput();
        this.userInput.initialize(this);

        this.backendData = new ClassroomBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new ClassroomHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ClassroomServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();
        console.log('this: ', this);
    }

    getSearchParametersString() {
        const searchParams = new URLSearchParams();
        Object.entries(this.mettingParameters).forEach(([key, value]: any) => searchParams.append(key, value));
        return searchParams.toString();
    }

}
