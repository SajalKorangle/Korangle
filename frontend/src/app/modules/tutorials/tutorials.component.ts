import { Component, OnInit } from '@angular/core';
import { DataStorage } from '@classes/data-storage';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class TutorialsComponent implements OnInit {
    user: any;

    constructor() {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }
}
