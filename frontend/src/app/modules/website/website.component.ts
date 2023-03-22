import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../classes/data-storage';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class WebsiteComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }
}
