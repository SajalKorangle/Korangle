import { Component, OnInit } from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {

  constructor() { }

    section = 'contact';

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
