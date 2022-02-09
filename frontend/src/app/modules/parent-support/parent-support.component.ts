import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../classes/data-storage';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class ParentSupportComponent implements OnInit {
    user: any;

    constructor() {}

    ngOnInit(): void {
    }
}
