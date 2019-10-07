import { Component, Input } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { isMobile } from "../../../../classes/common.js";

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})

export class ContactUsComponent {

     user;

    isLoading = false;

    constructor () { }
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    isMobile(): boolean {
        return isMobile();
    }

}
