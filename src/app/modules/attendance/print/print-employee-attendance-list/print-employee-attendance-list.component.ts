import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'print-employee-attendance-list',
    templateUrl: './print-employee-attendance-list.component.html',
    styleUrls: ['./print-employee-attendance-list.component.css'],
})
export class PrintEmployeeAttendanceListComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    employeeAttendanceList: any;
    startDate: any;
    endDate: any;
    by: any;

    viewChecked = true;

    printEmployeeAttendanceListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printEmployeeAttendanceListComponentSubscription =
            EmitterService.get('print-employee-attendance-list-component').subscribe( value => {
                console.log(value);
                this.employeeAttendanceList = value['employeeAttendanceList'];
                this.startDate = value['startDate'];
                this.endDate = value['endDate'];
                this.by = value['by'];
                this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.employeeAttendanceList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printEmployeeAttendanceListComponentSubscription.unsubscribe();
    }

    getDateList(): any {
        let dateList = [];

        let tempDate = new Date(this.startDate);
        let lastDate = new Date(this.endDate);

        while(tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }

    getStatus(status: any): any {
        let result = 'N';
        if (status) {
            result = status.substring(0,1);
        }
        return result;
    }

}
