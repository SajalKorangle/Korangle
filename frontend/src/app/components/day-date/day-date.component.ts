import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../date.adapter';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

import { Moment } from 'moment';

const moment = _moment;

@Component({
    selector: 'day-date',
    templateUrl: './day-date.component.html',
    styleUrls: ['./day-date.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: AppDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: APP_DATE_FORMATS,
        },
    ],
})
export class DayDateComponent implements OnInit {
    @Input() placeHolder = 'Choose a date';

    @Input() initialValue = new Date();

    @Input() nullButtonDisabled = false; // used in Design Report Card

    // @Input() acceptNull = false;

    @Input() minDate;

    @Input() formattedDateOutput = true;

    @Input() disableDatePicker = false;

    @Output() onDateSelected = new EventEmitter<any>();

    // date = new FormControl({value: new Date(), disabled: true});
    date: any;

    dateFilter = (d: Date | null): boolean => {
        let valid = true;
        if (this.minDate) {
            if ( d.getTime() < this.minDate.getTime()) {
                valid = false;
            }
        }
        return valid;
    }

    ngOnInit(): void {
        this.date = new FormControl({ value: this.initialValue, disabled: true });
        this.onDateChanged(this.date);
    }

    nullDate(): void {
        this.date = new FormControl({ value: null, disabled: true });
        this.onDateChanged(this.date);
    }

    onDateChanged(event: any): void {
        if (this.formattedDateOutput) {
            this.onDateSelected.emit(this.formatDate(event.value));
        } else {
            this.onDateSelected.emit(event.value);
        }
    }

    formatDate(dateStr: any): any {
        if (dateStr == null) {
            return null;
        }

        let d = new Date(dateStr);

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
