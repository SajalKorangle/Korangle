import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-marksheet-second-format',
    templateUrl: './print-marksheet-second-format.component.html',
    styleUrls: ['./print-marksheet-second-format.component.css'],
})
export class PrintMarksheetSecondFormatComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    marksheet: any;

    viewChecked = true;

    printMarksheetSecondFormatComponentSubscription: any;

    ngOnInit(): void {
        this.printMarksheetSecondFormatComponentSubscription = EmitterService.get('print-marksheet-second-format-component').subscribe( value => {
            this.marksheet = value;
            this.viewChecked = false;
        });
    }

    ngOnDestroy(): void {
        this.printMarksheetSecondFormatComponentSubscription.unsubscribe();
        this.marksheet = null;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.marksheet = null;
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
