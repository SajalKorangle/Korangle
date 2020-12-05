import { Component, OnInit } from '@angular/core';

import { User } from './classes/user';
import { DataStorage } from './classes/data-storage';

import {AuthenticationOldService} from '@services/authentication-old.service';
import {VersionCheckService} from './services/version-check.service';
import {environment} from '../environments/environment.prod';
import moment = require('moment');
import {NotificationService} from "./services/modules/notification/notification.service";
import {Constants} from "./classes/constants";
import {registerForNotification} from "./classes/common";
import {CommonFunctions} from './classes/common-functions';
import {MatDialog} from '@angular/material/dialog';
import {ModalVideoComponent} from '@basic-components/modal-video/modal-video.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ AuthenticationOldService, VersionCheckService, NotificationService ],
})

export class AppComponent implements OnInit {
    isLoading = false;
    countDownForValidity = -1;
    public user = new User();



    constructor(private authenticationService: AuthenticationOldService,
                private versionCheckService: VersionCheckService,
                private dialog: MatDialog,
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

    showTutorial() {
        this.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
        });
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
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
