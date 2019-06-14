import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {viewClassName} from "@angular/compiler";

@Component({
    selector: 'app-print-employee-list',
    templateUrl: './print-employee-list.component.html',
    styleUrls: ['./print-employee-list.component.css'],
})
export class PrintEmployeeListComponent implements OnInit, OnDestroy, AfterViewChecked {

    employeeList: any;
    columnFilter: any;

    viewChecked = true;

    printEmployeeListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printEmployeeListComponentSubscription = EmitterService.get('print-employee-list-component').subscribe( value => {
            this.employeeList = value['employeeList'];
            this.columnFilter = value['columnFilter'];
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.employeeList = null;
            this.columnFilter = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printEmployeeListComponentSubscription.unsubscribe();
    }

}
