import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomUserInput } from './classroom.user.input';
import { ClassroomBackendData } from './classroom.backend.data';

import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { StudentService } from '@services/modules/student/student.service';
import { SubjectService } from '@services/modules/subject/subject.service';

import { ERROR_REPORTING_URL } from '@services/modules/errors/error-reporting.service';
import { environment } from 'environments/environment';
import { Constants } from 'app/classes/constants';

import { WEEKDAYS, Time } from '@modules/online-classes/class/constants';

import { openUrlInChrome, isMobile } from '@classes/common.js';

@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [OnlineClassService, StudentService, SubjectService],
})

export class ClassroomComponent implements OnInit, OnDestroy {

    user: any;

    activeStudent: any;

    weekdays = WEEKDAYS;

    today: string = Object.values(WEEKDAYS)[new Date().getDay()];
    currentTime: Date = new Date();

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    userInput: ClassroomUserInput;
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
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.activeStudent = this.user.section.student;

        this.userInput = new ClassroomUserInput();
        this.userInput.initialize(this);

        this.backendData = new ClassroomBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new ClassroomHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ClassroomServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();
        // console.log('this: ', this);
    }

    ngOnDestroy(): void {
        // clearInterval(this.attendanceMarkerInterval);
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

    populateMeetingParametersAndStart(accountInfo, signature, apiKey) {
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
                if (isMobile()) {
                    openUrlInChrome(location.origin + '/assets/zoom/index.html?' + searchParams.toString());
                    this.htmlRenderer.meetingEntered = false;
                }
                else {
                    zoomIFrame.src = '/assets/zoom/index.html?' + searchParams.toString();
                }
            }
            // this.attendanceMarkerInterval = setInterval(this.serviceAdapter.updateAttendance, this.attendanceUpdateDuration * 1000);
            this.serviceAdapter.markAttendance();
        });
    }

}
