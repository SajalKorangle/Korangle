import { Component, Input } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

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

}
