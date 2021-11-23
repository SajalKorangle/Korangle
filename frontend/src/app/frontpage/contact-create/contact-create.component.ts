import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';

@Component({
    selector: 'app-contact-create',
    templateUrl: './contact-create.component.html',
    styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {

    constructor() {
    }

    pathName = ''; // takes path from the url and shows the corresponding section (contact or create)

    ngOnInit() {
        this.pathName = window.location.pathname;
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}


