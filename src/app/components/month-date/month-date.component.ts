import {Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

import { Moment } from 'moment';

// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MMM - YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'month-date',
    templateUrl: './month-date.component.html',
    styleUrls: ['./month-date.component.css'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class MonthDateComponent implements OnInit {

    @Input() showButton = false;
    @Input() user;
    @Input() biggerFont;
    @Input() previousMonth = false;

    @Output() onMonthSelected = new EventEmitter<any>();


    date: any;

    ngOnInit(): void {
        if (this.previousMonth) {
            this.date = new FormControl({value: moment().subtract(1, 'months').endOf('month'), disabled: true});
        } else {
            this.date = new FormControl({value: moment(), disabled: true});
        }
        this.onMonthSelected.emit(this.date.value._d);
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normlizedMonth.month());
        ctrlValue.year(normlizedMonth.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
        this.onMonthSelected.emit(this.date.value._d);
    }

    testing(event: any): void {
        console.log('okay');
        console.log(event);
    }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */