import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';
import {Router} from '@angular/router';


@Component({
    selector: 'app-frontpage2',
    templateUrl: './frontpage2.component.html',
    styleUrls: ['./frontpage2.component.css']
})
export class Frontpage2Component implements OnInit {

    constructor(private router: Router) {
    }

    section = 'normal';

    changePassword = false;
    path = window.location.pathname;

    ngOnInit() {
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    onOtpChange(event) {
        console.log(event);
    }

}
