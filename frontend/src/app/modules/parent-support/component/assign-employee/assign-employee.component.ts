import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-assign-employee',
    templateUrl: './assign-employee.component.html',
    styleUrls: ['./assign-employee.component.css']
})
export class AssignEmployeeComponent implements OnInit {
    user: any;

    helloCheckBox: boolean;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

}
