import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../classes/data-storage';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class ActivityComponent implements OnInit {

    constructor() {}

    ngOnInit(): void {
    }
}
