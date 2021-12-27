import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';

@Component({
    selector: 'authentication-component',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }


    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
