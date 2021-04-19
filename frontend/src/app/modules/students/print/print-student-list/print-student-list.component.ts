import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'app-print-student-list',
    templateUrl: './print-student-list.component.html',
    styleUrls: ['./print-student-list.component.css'],
})
export class PrintStudentListComponent implements OnInit, AfterViewChecked {
    studentList: any;
    // classSectionStudentList: any;
    columnFilter: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { value } = this.printService.getData();
        this.studentList = value['studentList'];
        this.columnFilter = value['columnFilter'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.studentList = null;
            this.columnFilter = null;
            this.cdRef.detectChanges();
        }
    }
}
