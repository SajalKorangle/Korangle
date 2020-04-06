import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-enquiry-list.component.html',
    styleUrls: ['./print-enquiry-list.component.css'],
})

export class PrintEnquiryListComponent implements OnInit, AfterViewChecked {


    user: any;
    classList = [];
    employeeList = [];

    data: any;

    checkView = false;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const {user, value} = this.printService.getData();
        this.user = user;
        this.data = value[0];
        this.classList=value[1];
        this.employeeList = value[2];
        this.checkView = true;
    }

    ngAfterViewChecked(): void {
        if(this.checkView) {
            this.checkView = false;
            this.printService.print();
            this.data = null;
            this.cdRef.detectChanges();
        }
    }
    getClassName(dbId: number): string {
        let className = '';
        this.classList.every(classs => {
            if (classs.dbId === dbId) {
                className = classs.name;
                return false;
            }
            return true;
        });
        return className;
    }

    getEmployeeName(employeeId: number): string {
        let employeeName = '';
        this.employeeList.every(employee => {
            if (employeeId === employee.id) {
                employeeName = employee.name;
                return false;
            }
            return true;
        });
        return employeeName;
    }
}
