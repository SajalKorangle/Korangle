import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-add-complaint',
    templateUrl: './add-complaint.component.html',
    styleUrls: ['./add-complaint.component.css']
})
export class AddComplaintComponent implements OnInit {

    user:any;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
