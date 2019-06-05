import {Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

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
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ],
})
export class DayDateComponent implements OnInit {

    @Input() initialValue = null;

    @Output() onDateSelected = new EventEmitter<any>();


    date = new FormControl({value: new Date(), disabled: true});

    ngOnInit(): void {

        if (this.initialValue) {
            this.date = new FormControl({value: this.initialValue, disabled: true});
        }

        this.onDateSelected.emit(this.date.value);
    }

    onDateChanged(event: any): void {
        this.onDateSelected.emit(event.value);
    }

}


/**  Copyright 2018 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
