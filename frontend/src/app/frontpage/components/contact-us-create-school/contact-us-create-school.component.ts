import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';

@Component({
    selector: 'contact-us-create-school-component',
    templateUrl: './contact-us-create-school.component.html',
    styleUrls: ['./contact-us-create-school.component.css']
})
export class ContactUsCreateSchoolComponent implements OnInit {

    constructor() {
    }


    ngOnInit() {
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}


