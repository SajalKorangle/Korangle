import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-bus-stop *ngIf="user.section.subRoute===\'update_bus_stop\'" [user]="user"></update-bus-stop>' +
    '<add-bus-stop *ngIf="user.section.subRoute===\'add_bus_stop\'" [user]="user"></add-bus-stop>' +
    '<delete-bus-stop *ngIf="user.section.subRoute===\'delete_bus_stop\'" [user]="user"></delete-bus-stop>',
})

export class VehicleComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
