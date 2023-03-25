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
import { MatDialog } from '@angular/material/dialog';
import { AppHtmlRenderer } from './app.html.renderer';
import { PaymentResponseDialogComponent } from '@basic-components/payment-response-dialog/payment-response-dialog.component';
import { FeatureFlagService } from '@services/feature-flag.service';
import { GenericService } from '@services/generic/generic-service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AuthenticationOldService, AuthenticationService, VersionCheckService, NotificationService, FeatureFlagService, GenericService],
})
export class AppComponent implements OnInit {
    isLoading = false;
    public user = new User(this.genericService);

    featureFlagListIsFetched = false;

    htmlRenderer: AppHtmlRenderer;

    constructor(
        private authenticationService: AuthenticationOldService,
        private versionCheckService: VersionCheckService,
        private featureFlagService: FeatureFlagService,
        private genericService: GenericService,
        private dialog: MatDialog) { }

    ngOnInit() {

        this.featureFlagService.getFeatureFlagList().then(value => {
            DataStorage.getInstance().setFeatureFlagList(value);
            this.featureFlagListIsFetched = true;
        });

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

}
