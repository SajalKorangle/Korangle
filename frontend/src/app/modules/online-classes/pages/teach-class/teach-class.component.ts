import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataStorage } from "@classes/data-storage";

import { TeachClassServiceAdapter } from './teach-class.service.adapter';
import { TeachClassHtmlRenderer } from './teach-class.html.renderer';
import { TeachClassBackendData } from './teach-class.backend.data';

// services
import { SubjectService } from '@services/modules/subject/subject.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SchoolService } from '@services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';

import { Time, WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME, ZOOM_BASE_URL, ColorPaletteHandle, TimeComparator } from '@modules/online-classes/class/constants';

import { isMobile, openUrlInBrowser } from '@classes/common.js';

import { CommonFunctions } from '@classes/common-functions';

@Component({
    selector: 'classroom',
    templateUrl: './teach-class.component.html',
    styleUrls: ['./teach-class.component.css'],
    providers: [SubjectService, OnlineClassService, ClassService, SchoolService, GenericService],
})

export class TeachClassComponent implements OnInit, OnDestroy {

    user: any;

    commonFunctions = CommonFunctions.getInstance();

    isMobile = isMobile;

    weekdayKeysMappedByDisplayName = WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME;

    todayDisplayName: string = Object.values(WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME)[new Date().getDay()];
    currentTime: Date = new Date();

    timeHandleInterval;

    serviceAdapter: TeachClassServiceAdapter;
    htmlRenderer: TeachClassHtmlRenderer;
    backendData: TeachClassBackendData;

    isPasswordVisible: boolean = false;
    isActiveSession: boolean;

    isLoading: any;

    constructor(
        public subjectService: SubjectService,
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public schoolService: SchoolService,
        public genericService: GenericService,
        public snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.backendData = new TeachClassBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new TeachClassHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new TeachClassServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

        this.timeHandleInterval = setInterval(() => this.currentTime = new Date(), 30000);

        // console.log('this: ', this);
    }

    ngOnDestroy(): void {
        clearInterval(this.timeHandleInterval);
    }

    initializeTimeTable() {
        ColorPaletteHandle.reset(); // resets mapping of subjects with colors
        this.htmlRenderer.timeBreakPoints = [];

        this.htmlRenderer.getOverlappingFilteredOnlineClassList().forEach(onlineClass => {
            let startTimeAlreadyPresent: boolean = false;
            let endTimeAlreadyPresent: boolean = false;
            this.htmlRenderer.timeBreakPoints.forEach(timeSpan => {
                if (TimeComparator(onlineClass.startTimeJSON, timeSpan) == 0) {
                    startTimeAlreadyPresent = true;
                }
                if (TimeComparator(onlineClass.endTimeJSON, timeSpan) == 0) {
                    endTimeAlreadyPresent = true;
                }
            });
            if (!startTimeAlreadyPresent) {
                this.htmlRenderer.timeBreakPoints.push(new Time({ ...onlineClass.startTimeJSON }));
            }
            if (!endTimeAlreadyPresent) {
                this.htmlRenderer.timeBreakPoints.push(new Time({ ...onlineClass.endTimeJSON }));
            }
        });
        this.htmlRenderer.timeBreakPoints.sort(TimeComparator);
    }

    redirectToMeeting(): void {
        if (this.backendData.accountInfo.meetingNumber) {
            if (isMobile()) {
                openUrlInBrowser(ZOOM_BASE_URL + '/' + this.backendData.accountInfo.meetingNumber);
                return;
            }
            window.open(ZOOM_BASE_URL + '/' + this.backendData.accountInfo.meetingNumber, '_blank');
        }
        else {
            if (isMobile()) {
                openUrlInBrowser(this.backendData.accountInfo.meetingUrl);
                return;
            }
            window.open(this.backendData.accountInfo.meetingUrl, '_blank');
        }
    }

}
