import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-salary-sheet-list.component.html',
    styleUrls: ['./print-salary-sheet-list.component.css'],
})
export class PrintSalarySheetListComponent implements OnInit, OnDestroy, AfterViewChecked {
    user: any;

    viewChecked = true;

    employeeList: any;
    month: any;
    year: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.employeeList = value['employeeList'];
        this.month = value['month'];
        this.year = value['year'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.employeeList = null;
            this.month = null;
            this.year = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.employeeList = null;
        this.month = null;
        this.year = null;
    }

    getNetTotalAmount(): number {
        let amount = 0;
        this.employeeList.forEach((item) => {
            amount += item.netSalary;
        });
        return amount;
    }
}
