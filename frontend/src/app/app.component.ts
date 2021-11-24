import { Component, OnInit } from '@angular/core';

import { User } from './classes/user';
import { DataStorage } from './classes/data-storage';

import { AuthenticationService } from '@services/modules/authentication/authentication.service';
import { AuthenticationOldService } from '@services/authentication-old.service';
import { VersionCheckService } from './services/version-check.service';
import { environment } from '../environments/environment';
import { NotificationService } from './services/modules/notification/notification.service';
import { Constants } from './classes/constants';
import { registerForNotification } from './classes/common';
import { CommonFunctions } from './classes/common-functions';
import { MatDialog } from '@angular/material/dialog';
import { ModalVideoComponent } from '@basic-components/modal-video/modal-video.component';
import { AppHtmlRenderer } from './app.html.renderer';
import { PaymentResponseDialogComponent } from '@basic-components/payment-response-dialog/payment-response-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AuthenticationOldService, AuthenticationService, VersionCheckService, NotificationService],
})
export class AppComponent implements OnInit {
    isLoading = false;
    public user = new User();

    pathName = ''; // uses url path to show the respective components (contact-create or authentication)
    htmlRenderer: AppHtmlRenderer;

    constructor(
        private authenticationService: AuthenticationOldService,
        private versionCheckService: VersionCheckService,
        private dialog: MatDialog,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        DataStorage.getInstance().setUser(this.user);
        if (this.user.checkAuthentication()) {
            this.authenticationService.getUserDetails(this.user.jwt).then((data) => {
                if (data === 'failed') {
                    console.log('authentication failed');
                    this.user.isAuthenticated = false;
                    this.user.jwt = '';
                    localStorage.setItem('schoolJWT', '');
                } else {
                    this.user.initializeUserData(data);
                    (<any>window).ga('set', 'userId', 'id: ' + data.id);
                    (<any>window).ga('send', 'event', 'authentication', 'Direct Entry');
                    registerForNotification({
                        user: this.user.id,
                        jwt: this.user.jwt,
                        url: environment.DJANGO_SERVER + Constants.api_version + '/notification/gcm-devices',
                    });
                }
            });
        }

        this.versionCheckService.initVersionCheck(environment.versionCheckURL);

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        this.htmlRenderer = new AppHtmlRenderer();
        this.htmlRenderer.initialize(this);
        this.pathName = window.location.pathname;

        const urlParams = new URLSearchParams(location.search);
        if (urlParams.has('orderId')) {
            this.openPaymentResponseDialog();
        }

    }

    openPaymentResponseDialog() {
        this.dialog.open(PaymentResponseDialogComponent, {
            data: {}
        });
    }

    showTutorial(url: any) {
        this.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
            data: {
                videoUrl: url,
            },
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

    isCreateOrContact() {
        // as ngOnInit of appComponent won't be called all the time,
        // we are updating pathName here to always keep the variable in sync with url
        this.pathName = window.location.pathname;

        // checking whether the pathName matches any of the contact-create paths (true -> contact-create, false -> authentication)
        return this.pathName == '/contact-us' || this.pathName == '/create-school';
    }
}
