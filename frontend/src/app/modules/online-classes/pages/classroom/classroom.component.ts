import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomUserInput } from './classroom.user.input';
import { ClassroomBackendData } from './classroom.backend.data';

import { SubjectService } from '@services/modules/subject/subject.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SchoolService } from '@services/modules/school/school.service';

import { Time, WEEKDAYS, ZOOM_BASE_URL, ParsedOnlineClass } from '@modules/online-classes/class/constants';

import { isMobile, openZoomMeeting } from '@classes/common.js';

@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [SubjectService, OnlineClassService, ClassService, SchoolService],
})

export class ClassroomComponent implements OnInit, OnDestroy {

    user: any;

    isMobile = isMobile;

    weekdays = WEEKDAYS;

    today: string = Object.values(WEEKDAYS)[new Date().getDay()];
    currentTime: Date = new Date();

    timeHandleInterval;

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    userInput: ClassroomUserInput;
    backendData: ClassroomBackendData;

    isActiveSession: boolean;

    isLoading: any;

    constructor(
        public subjectService: SubjectService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public schoolService: SchoolService,
        public snackBar: MatSnackBar,
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

        this.timeHandleInterval = setInterval(() => this.currentTime = new Date(), 30000);

        // console.log('this: ', this);
    }

    ngOnDestroy(): void {
        clearInterval(this.timeHandleInterval);
    }

    getObjetKeys(obj: { [key: string]: any; }): Array<string> {
        return Object.keys(obj);
    }

    parseBacknedData() {
        this.backendData.onlineClassList.forEach(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
        });
    }

    redirectToMeeting(): void {
        if (isMobile()) {
            openZoomMeeting(ZOOM_BASE_URL + '/' + this.backendData.accountInfo.meetingNumber);
            return;
        }
        window.open(ZOOM_BASE_URL + '/' + this.backendData.accountInfo.meetingNumber, '_blank');
    }

    selectTextFromElement(element: HTMLElement) {
        navigator.clipboard.writeText(element.innerText);
        this.snackBar.open("Copied To Clipboard", undefined, { duration: 2000 });
    }

}
