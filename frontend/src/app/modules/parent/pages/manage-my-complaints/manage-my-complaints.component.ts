import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-manage-my-complaints',
    templateUrl: './manage-my-complaints.component.html',
    styleUrls: ['./manage-my-complaints.component.css']
})
export class ManageMyComplaintsComponent implements OnInit {
    user: any;

    seachString: string = "";

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
