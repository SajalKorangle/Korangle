import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

    // section variable which defines whether to show forgot-password or login-signup
    section = 'login-signup';

    constructor() {
    }


    ngOnInit(): void {
    }


    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
