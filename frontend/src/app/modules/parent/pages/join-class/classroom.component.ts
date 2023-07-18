import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomBackendData } from './classroom.backend.data';

import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { StudentService } from '@services/modules/student/student.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import { GenericService } from '@services/generic/generic-service';

import { ERROR_REPORTING_URL } from '@services/modules/errors/error-reporting.service';
import { environment } from 'environments/environment';
import { Constants } from 'app/classes/constants';

import { WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME, Time } from '@modules/online-classes/class/constants';

import { openUrlInChrome, isMobile, openUrlInBrowser } from '@classes/common.js';

import { CommonFunctions } from '@classes/common-functions';
@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [OnlineClassService, StudentService, SubjectService, GenericService],
})

export class ClassroomComponent implements OnInit, OnDestroy {

    user: any;

    commonFunctions = CommonFunctions.getInstance();

    activeStudent: any;

    weekdayKeysMappedByDisplayName = WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME;

    today: string = Object.values(WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME)[new Date().getDay()];
    currentTime: Date = new Date();

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    backendData: ClassroomBackendData;

    meetingParameters: any;

    // attendanceUpdateDuration: number = 180; // in seconds
    // attendanceMarkerInterval: any;
    // studentAttendanceDownTime: number = 0;  // in seconds

    restrictedStudent = null;
    isActiveSession: boolean = false;
    isLoading: any;

    constructor(
        public onlineClassService: OnlineClassService,
        public studentService: StudentService,
        public subjectService: SubjectService,
        public genericService: GenericService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.activeStudent = this.user.section.student;
        this.restrictedStudent = this.activeStudent.isRestricted;

        this.backendData = new ClassroomBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new ClassroomHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ClassroomServiceAdapter();
        this.serviceAdapter.initialize(this);
        if (!this.restrictedStudent) { //data is fetched when the student is not restricted
            this.serviceAdapter.initializeData();
        }
        // console.log('this: ', this);
    }

    ngOnDestroy(): void {
        // clearInterval(this.attendanceMarkerInterval);
    }

    populateMeetingParametersAndStart(accountInfo, signature, apiKey) {
        this.serviceAdapter.markAttendance();
        if (accountInfo.meetingNumber) {
            // clearInterval(this.attendanceMarkerInterval);
            this.meetingParameters = {
                signature,
                api_key: apiKey,
                meeting_number: accountInfo.meetingNumber,
                password: accountInfo.passcode,
                role: 0,
                username: this.activeStudent.name,
                leaveUrl: location.protocol + "//" + location.host + '/assets/zoom/feedback.html',
                error_logging_endpoint: environment.DJANGO_SERVER + Constants.api_version + ERROR_REPORTING_URL,
            };
            this.htmlRenderer.meetingEntered = true;
            setTimeout(() => {
                let zoomIFrame: Partial<HTMLIFrameElement> = document.getElementById('zoomIFrame');
                while (!zoomIFrame && this.htmlRenderer.meetingEntered) {
                    zoomIFrame = document.getElementById('zoomIFrame');
                }
                if (this.htmlRenderer.meetingEntered) {
                    const searchParams = new URLSearchParams();
                    Object.entries(this.meetingParameters).forEach(([key, value]: any) => searchParams.append(key, value));
                    const encodedSearchParams = btoa(searchParams.toString());
                    console.log(btoa(searchParams.toString()));
                    if (isMobile()) {
                        openUrlInChrome(location.origin + '/assets/zoom/index.html?' + encodedSearchParams);
                        this.htmlRenderer.meetingEntered = false;
                    }
                    else {
                        zoomIFrame.src = '/assets/zoom/index.html?' + encodedSearchParams;
                    }
                }
                // this.attendanceMarkerInterval = setInterval(this.serviceAdapter.updateAttendance, this.attendanceUpdateDuration * 1000);
            });
        }
        else {
            if (isMobile()) {
                openUrlInBrowser(accountInfo.meetingUrl);
                return;
            }
            window.open(accountInfo.meetingUrl, '_blank');
        }
    }

}
