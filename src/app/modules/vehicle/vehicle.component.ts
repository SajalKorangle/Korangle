import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-bus-stop *ngIf="user.activeTask.path===\'update_bus_stop\'" [user]="user"></update-bus-stop>' +
    '<add-bus-stop *ngIf="user.activeTask.path===\'add_bus_stop\'" [user]="user"></add-bus-stop>' +
    '<delete-bus-stop *ngIf="user.activeTask.path===\'delete_bus_stop\'" [user]="user"></delete-bus-stop>',
})

export class VehicleComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
