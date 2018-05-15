import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../classes/data-storage';

@Component({
    template: ' <employee-profile [user]="user"></employee-profile> ',
})

export class EmployeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
