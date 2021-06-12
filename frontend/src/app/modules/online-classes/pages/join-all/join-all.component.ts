import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { JoinAllServiceAdapter } from './join-all.service.adapter';
import { JoinAllHtmlRenderer } from './join-all.html.renderer';

import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';
import {OnlineClass} from '@services/modules/online-class/models/online-class';

import { SubjectService } from '@services/modules/subject/subject.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SchoolService } from '@services/modules/school/school.service';
import { EmployeeService} from '@services/modules/employee/employee.service';

import { TimeSpan, TimeComparator, TimeSpanComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';
import {  WEEKDAYS, ZOOM_BASE_URL } from '@modules/online-classes/class/constants';
import { isMobile, openZoomMeeting } from '@classes/common.js';
import { Constants } from 'app/classes/constants';
import { environment } from 'environments/environment';
import { ERROR_REPORTING_URL } from '@services/modules/errors/error-reporting.service';


@Component({
    selector: 'join-all',
    templateUrl: './join-all.component.html',
    styleUrls: ['./join-all.component.css'],
    providers: [SubjectService, OnlineClassService, ClassService, SchoolService, EmployeeService ],
})

export class JoinAllComponent implements OnInit {

    onlineClassList: Array<ParsedOnlineClass>;
    accountInfoList: Array<AccountInfo>;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    classList: Array<any>;
    divisionList: Array<any>;
    employeeList: Array<any>;


    weekdays = WEEKDAYS;

    today: string = Object.values(WEEKDAYS)[new Date().getDay()];
    currentTime: Date = new Date();

    user: any;

    serviceAdapter: JoinAllServiceAdapter;
    htmlRenderer: JoinAllHtmlRenderer;

    userInput = {};
    backendData = {};
    isLoading: any;
    isActiveSession: any;

    meetingEntered: boolean = false;
    meetingParameters: any;
    userEmployee: any;
    timeHandleInterval;

    constructor ( public subjectService: SubjectService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public schoolService: SchoolService,
        public employeeService: EmployeeService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new JoinAllHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new JoinAllServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();
        this.timeHandleInterval = setInterval(() => this.currentTime = new Date(), 30000);

        // console.log(this);
    }
    ngOnDestroy(): void {
        clearInterval(this.timeHandleInterval);
    }
    parseBackendData() {
        this.onlineClassList.forEach(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
        });
    }
    getAllActiveClasses(): any {
        return this.onlineClassList.filter(onlineClass => {
            return this.isActiveClass(onlineClass);
        });
    }
    isActiveClass(onlineClass: ParsedOnlineClass): boolean {
        if (onlineClass.day != this.today) return false;
        const currentTime = this.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });

        const timeDiffStart = onlineClass.startTimeJSON.diffInMinutes(customTime);
        const timeDiffEnd = onlineClass.endTimeJSON.diffInMinutes(customTime);
        if (timeDiffStart >= 0 && timeDiffEnd <= 0) {
            return true;
        }
        return false;
    }
    getClassSubjectById(id: any): any {
        let tempClassSubject = this.classSubjectList.find((onlineClass) => {
            return onlineClass.id == id;
        });
        let className = this.classList.find((classItem) => {
            return classItem.id == tempClassSubject.parentClass;
        }).name;
        let divisionName = this.divisionList.find((classItem) => {
            return classItem.id == tempClassSubject.parentDivision;
        }).name;
        let subjectName = this.subjectList.find((subject) => {
            return subject.id == tempClassSubject.parentSubject;
        }).name;
        let teacherName = this.employeeList.find((employee) => {
            return employee.id == tempClassSubject.parentEmployee;
        }).name;
        let accountInfo = this.accountInfoList.find((accountInfo) => {
            return accountInfo.parentEmployee == tempClassSubject.parentEmployee;
        });

        return {className, divisionName, subjectName, teacherName, accountInfo};
    }

    populateMeetingParametersAndStart(accountInfo, signature, apiKey) {
        // clearInterval(this.attendanceMarkerInterval);
        this.userEmployee = this.employeeList.find((employee) => {
            return employee.id == this.user.activeSchool.employeeId;
        });
        // console.log(this.userEmployee.name);
        this.meetingParameters = {
            signature,
            api_key: apiKey,
            meeting_number: accountInfo.meetingNumber,
            password: accountInfo.passcode,
            role: 0,
            username: this.userEmployee.name,
            leaveUrl: location.protocol + "//" + location.host + '/assets/zoom/feedback.html',
            error_logging_endpoint: environment.DJANGO_SERVER + Constants.api_version + ERROR_REPORTING_URL,
        };
        this.meetingEntered = true;
        setTimeout(() => {
            let zoomIFrame: Partial<HTMLIFrameElement> = document.getElementById('zoomIFrame');
            while (!zoomIFrame && this.meetingEntered) {
                zoomIFrame = document.getElementById('zoomIFrame');
            }
            if (this.meetingEntered) {
                const searchParams = new URLSearchParams();
                Object.entries(this.meetingParameters).forEach(([key, value]: any) => searchParams.append(key, value));
                if (isMobile()) {
                    openZoomMeeting(location.origin + '/assets/zoom/index.html?' + searchParams.toString());
                }
                else {
                    zoomIFrame.src = '/assets/zoom/index.html?' + searchParams.toString();
                }
            }
        });
    }
}
