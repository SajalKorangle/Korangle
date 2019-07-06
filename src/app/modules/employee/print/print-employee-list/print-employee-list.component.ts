import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'app-print-employee-list',
    templateUrl: './print-employee-list.component.html',
    styleUrls: ['./print-employee-list.component.css'],
})
export class PrintEmployeeListComponent implements OnInit, AfterViewChecked {

    employeeList: any;
    columnFilter: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { value } = this.printService.getData();
        this.employeeList = value['employeeList'];
        this.columnFilter = value['columnFilter'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.employeeList = null;
            this.columnFilter = null;
            this.cdRef.detectChanges();
        }
    }

}
