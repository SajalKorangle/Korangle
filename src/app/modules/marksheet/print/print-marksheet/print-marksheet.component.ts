import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-marksheet',
    templateUrl: './print-marksheet.component.html',
    styleUrls: ['./print-marksheet.component.css'],
})

export class PrintMarksheetComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    marksheet: any;

    viewChecked = true;

    printMarksheetComponentSubscription: any;

    constructor(private cdRef:ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printMarksheetComponentSubscription = EmitterService.get('print-marksheet-component').subscribe( value => {
            this.marksheet = value;
            this.viewChecked = false;
        });
    }

    ngOnDestroy(): void {
        this.printMarksheetComponentSubscription.unsubscribe();
        this.marksheet = null;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
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
