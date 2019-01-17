import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-salary-sheet',
    templateUrl: './print-salary-sheet.component.html',
    styleUrls: ['./print-salary-sheet.component.css'],
})
export class PrintSalarySheetComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    employeeList: any;
    month: any;
    year: any;

    printSalarySheetComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printSalarySheetComponentSubscription =
            EmitterService.get('print-salary-sheet-component').subscribe(value => {
                this.employeeList = value['employeeList'];
                this.month = value['month'];
                this.year = value['year'];
                this.viewChecked = false;
            });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.employeeList = null;
            this.month = null;
            this.year = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printSalarySheetComponentSubscription.unsubscribe();
        this.employeeList = null;
        this.month = null;
        this.year = null;
    }

    getNetTotalAmount(): number {
        let amount = 0;
        this.employeeList.forEach(item => {
            amount += item.netSalary;
        });
        return amount;
    }

}
