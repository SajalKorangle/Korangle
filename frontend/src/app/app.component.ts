import { Component, OnInit } from '@angular/core';

import { User } from './classes/user';
import { DataStorage } from './classes/data-storage';

import {AuthenticationService} from './services/authentication.service';
import {VersionCheckService} from './services/version-check.service';
import {environment} from '../environments/environment.prod';
import {NotificationService} from "./services/modules/notification/notification.service";
import {Constants} from "./classes/constants";
import {registerForNotification} from "./classes/common";
import {CommonFunctions} from './classes/common-functions';
import {MatDialog} from '@angular/material/dialog';
import {ModalVideoComponent} from './basic-components/modal-video/modal-video.component';
import { NavigationEnd, Router } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ AuthenticationService, VersionCheckService, NotificationService ],
})

export class AppComponent implements OnInit {

    isLoading = false;
    public user = new User();
    constructor(private authenticationService: AuthenticationService,
                private versionCheckService: VersionCheckService,
                private dialog: MatDialog,
                private notificationService: NotificationService,
                public router: Router) {
                    this.router.events.subscribe(event => {
                        if (event instanceof NavigationEnd) {     
                            if(this.router.url != '/')       
                            {
                                (<any>window).ga('set', 'page', event.urlAfterRedirects);
                                (<any>window).ga('send', 'pageview');
                            }               
                            
                          }
                      });
                }

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
                    //Sending the user-id of user to google-analytics to monitor per user flow
                    (<any>window).ga('set', 'userId', 'id: '+data.id+' user-name: '+data.username+ ' name: '+data.first_name+' '+data.last_name);
                    (<any>window).ga('send', 'event', 'authentication', 'user-id available');
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

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
