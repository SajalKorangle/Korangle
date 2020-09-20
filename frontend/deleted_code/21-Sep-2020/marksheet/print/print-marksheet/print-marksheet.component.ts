import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'app-print-marksheet',
    templateUrl: './print-marksheet.component.html',
    styleUrls: ['./print-marksheet.component.css'],
})

export class PrintMarksheetComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;

    marksheet: any;

    viewChecked = true;

    constructor(private cdRef:ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const {user, value} = this.printService.getData();
        this.user = user;
        this.marksheet = value;
        this.viewChecked = false;
    }

    ngOnDestroy(): void {
        this.marksheet = null;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.marksheet = null;
            this.cdRef.detectChanges();
        }
    }

    getTotalMaximumMarks(marksheet: any) {
        let totalMarks = 0;
        marksheet.result.forEach( result => {
            if (result.governmentSubject) {
                totalMarks += result.maximumMarks;
            }
        });
        return totalMarks;
    }

    getTotalMarksObtained(marksheet: any) {
        let totalMarksObtained = 0;
        marksheet.result.forEach( result => {
            if (result.governmentSubject) {
                totalMarksObtained += parseFloat(result.marksObtained);
            }
        });
        return totalMarksObtained;
    }

    getPercentage(marksheet: any) {
        return this.getTotalMarksObtained(marksheet)/this.getTotalMaximumMarks(marksheet)*100;
    }

}
