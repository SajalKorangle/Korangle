import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css'],
})

export class EmployeeProfileComponent implements OnInit {

    @Input() user;

    constructor() { }

    ngOnInit(): void {
    }

}
