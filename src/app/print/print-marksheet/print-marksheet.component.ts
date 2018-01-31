import { Component, OnInit, OnDestroy } from '@angular/core';

import { Marksheet } from '../../classes/marksheet';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-marksheet',
    templateUrl: './print-marksheet.component.html',
    styleUrls: ['./print-marksheet.component.css'],
})
export class PrintMarksheetComponent implements OnInit, OnDestroy {

    marksheet: Marksheet;
    totalMarks: number;

    printMarksheetComponentSubscription: any;

    ngOnInit(): void {
        EmitterService.get('print-marksheet-component').subscribe( value => {
            this.marksheet = value;
            this.totalMarks = 0.0;
            this.marksheet.marks.forEach(
                marks => {
                    this.totalMarks += Number(marks.marks);
                }
            );
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printMarksheetComponentSubscription.unsubscribe();
    }

}
