import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomUserInput } from './classroom.user.input';
import { ClassroomBackendData } from './classroom.backend.data';

import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SchoolService } from '@services/modules/school/school.service';
import { StudentService } from '@services/modules/student/student.service';
import { ERROR_REPORTING_URL } from '@services/modules/errors/error-reporting.service';
import { environment } from 'environments/environment';
import { Constants } from 'app/classes/constants';

import { WEEKDAYS } from '@modules/online-classes/class/constants';

@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [SchoolService, OnlineClassService, ClassService, StudentService],
})

export class ClassroomComponent implements OnInit {

    user: any;

    activeStudent: any;

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    userInput: ClassroomUserInput;
    backendData: ClassroomBackendData;

    meetingParameters: any;

    weekdays = WEEKDAYS;

    isLoading: any;

    constructor(
        public schoolService: SchoolService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public studentService: StudentService,
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

    populateMeetingParametersAndStart(onlineClass, signature, apiKey) {
        this.meetingParameters = {
            signature,
            api_key: apiKey,
            meeting_number: onlineClass.meetingNumber,
            password: onlineClass.password,
            role: 0,
            username: this.activeStudent.name,
            leaveUrl: location.host + '/assets/zoom/feedback.html',
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
                zoomIFrame.src = '/assets/zoom/index.html?' + searchParams.toString();

            }
        });
    }

}
