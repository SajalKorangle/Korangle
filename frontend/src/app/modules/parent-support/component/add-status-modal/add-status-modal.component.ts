import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-add-status-modal',
    templateUrl: './add-status-modal.component.html',
    styleUrls: ['./add-status-modal.component.css']
})
export class AddStatusModalComponent implements OnInit {
    user: any;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
