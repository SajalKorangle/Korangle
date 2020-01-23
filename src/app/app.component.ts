import { Component, OnInit } from '@angular/core';

import { User } from './classes/user';
import { DataStorage } from './classes/data-storage';

import {AuthenticationService} from './services/authentication.service';
import {VersionCheckService} from './services/version-check.service';
import {environment} from '../environments/environment.prod';
import moment = require('moment');
import {NotificationService} from "./services/modules/notification/notification.service";
import {Constants} from "./classes/constants";
import {registerForNotification} from "./classes/common";
import {EmitterService} from "./services/emitter.service";
import {CommonFunctions} from "./classes/common-functions";

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ AuthenticationService, VersionCheckService, NotificationService ],
})

export class AppComponent implements OnInit {
    subRouteValue: string;
    isLoading = false;
    countDownForValidity = -1;

	public user = new User();



    constructor(private authenticationService: AuthenticationService,
                private versionCheckService: VersionCheckService,
                private notificationService: NotificationService) {}

    ngOnInit() {

        DataStorage.getInstance().setUser(this.user);
        if (this.user.checkAuthentication()) {
            this.authenticationService.getUserDetails(this.user.jwt).then( data => {
                if (data === 'failed') {
                    console.log('authentication failed');
                    this.user.isAuthenticated = false;
                    this.user.jwt = '';
                    localStorage.setItem('schoolJWT', '');
                } else {
                    this.user.initializeUserData(data);
                    this.lastMonthIsGoingOn();
                    registerForNotification({
                        'user': this.user.id,
                        'jwt': this.user.jwt,
                        'url': environment.DJANGO_SERVER + Constants.api_version + '/notification/gcm-devices'
                    });
                }
            });
        }

        this.versionCheckService.initVersionCheck(environment.versionCheckURL);
    }

    refresh() {
        this.subRouteValue = this.user.section.subRoute ;
        this.user.section.subRoute = null;
        this.isLoading = true;
        setTimeout(() => {
            this.user.section.subRoute = this.subRouteValue;
            this.isLoading = false;
        }, 1000);
    }

    userHasAssignTaskCapability(): boolean {
        for (let i = 0; i < this.user.activeSchool.moduleList.length; i++) {
            if (this.user.activeSchool.moduleList[i].path === 'employees') {
                const cd = this.user.activeSchool.moduleList[i];
                for (let j = 0; j < cd.taskList.length; j++) {
                    if (cd.taskList[j].path === 'assign_task') {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lastMonthIsGoingOn(): boolean {
        const date1 = new Date();
        if (this.userHasAssignTaskCapability()) {
            const date2 = moment(this.user.activeSchool.dateOfExpiration);
            const diff1 = moment.duration(date2.diff(date1)).asDays();
            const diff2 = Math.ceil(diff1);
            if (diff2 <= 15) {
                this.countDownForValidity = diff2;
            }
            if (diff2 <= 30) {
                return true;
            } else {
                return false;
            }
        }
    }
    isMobile(): boolean {
        //return isMobile();
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
}
