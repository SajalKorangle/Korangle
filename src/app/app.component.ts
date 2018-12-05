import { Component, OnInit } from '@angular/core';

import { User } from './classes/user';
import { DataStorage } from './classes/data-storage';

import {AuthenticationService} from './services/authentication.service';
import {VersionCheckService} from './services/version-check.service';
import {environment} from '../environments/environment.prod';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ AuthenticationService, VersionCheckService ],
})
export class AppComponent implements OnInit {

	public user = new User();

    constructor(private authenticationService: AuthenticationService,
                private versionCheckService: VersionCheckService) {}

    ngOnInit() {

        DataStorage.getInstance().setUser(this.user);
        // localStorage.setItem('schoolJWT', '');
        if (this.user.checkAuthentication()) {
            this.authenticationService.getUserDetails(this.user.jwt).then( data => {
                if (data === '') {
                    this.user.isAuthenticated = false;
                    this.user.jwt = '';
                } else {
                    this.user.initializeUserData(data);
                }
            });
        }

        this.versionCheckService.initVersionCheck(environment.versionCheckURL);

    }

}
