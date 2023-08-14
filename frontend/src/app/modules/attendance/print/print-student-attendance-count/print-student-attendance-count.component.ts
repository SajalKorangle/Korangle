import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PrintService } from 'app/print/print-service';

@Component({
    selector: 'app-print-student-attendance-count',
    templateUrl: './print-student-attendance-count.component.html',
    styleUrls: ['./print-student-attendance-count.component.css']
})

export class PrintStudentAttendanceCountComponent implements OnInit, AfterViewChecked {

    user: any;
    viewChecked = true;
    studentAttendanceCountList: any;
    dateSelected: any;

    constructor(
        private printService: PrintService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        const { user,value } = this.printService.getData();
        this.user = user;
        this.studentAttendanceCountList = value['studentAttendanceCountList'];
        this.viewChecked = false;
        this.dateSelected = value['dateSelected'];
    }

    ngAfterViewChecked(): void {
        if(this.viewChecked === false){
            this.viewChecked = true;
            this.printService.print();
            this.studentAttendanceCountList = null;
            this.cdRef.detectChanges();
        }
    }
}
