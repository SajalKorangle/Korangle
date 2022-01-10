import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-open-message',
    templateUrl: './open-message.component.html',
    styleUrls: ['./open-message.component.css']
})
export class OpenMessageComponent implements OnInit {
    user: any;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
