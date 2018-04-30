import { Component, Input, OnInit } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";


import { FeeService } from '../../fee.service';

const APRIL = 'APRIL';
const MAY = 'MAY';
const JUNE = 'JUNE';
const JULY = 'JULY';
const AUGUST = 'AUGUST';
const SEPTEMBER = 'SEPTEMBER';
const OCTOBER = 'OCTOBER';
const NOVEMBER = 'NOVEMBER';
const DECEMBER = 'DECEMBER';
const JANUARY = 'JANUARY';
const FEBRUARY = 'FEBRUARY';
const MARCH = 'MARCH';


@Component({
    selector: 'app-set-school-fees',
    templateUrl: './set-school-fees.component.html',
    styleUrls: ['./set-school-fees.component.css'],
    providers: [ FeeService ],
    animations: [
        trigger('rotate', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('true => false', animate('800ms linear')),
            transition('false => true', animate('800ms linear'))
        ]),
        trigger('slideDown', [
            state('true', style({height: '*'})),
            state('false', style({height: 0, overflow: 'hidden'})),
            transition('true => false', animate('800ms linear')),
            transition('false => true', animate('800ms linear'))
        ])
    ],
})

export class SetSchoolFeesComponent implements OnInit {

    @Input() user;

    filterTypeList = [
        'NONE',
        'CLASS',
        'BUS STOP',
        'CLASS AND BUS STOP',
    ];

    frequencyList = [
        'YEARLY',
        'MONTHLY',
    ];

    selectedFeeType: any;

    feeTypeList: any;

    currentFeeDefinition: any;

    // selectedFilterType: any;

    // selectedFrequency: any;

    // rteChecked: boolean;

    isLoading = false;

    constructor (private feeService: FeeService) { }

    ngOnInit(): void {
        this.feeService.getFeeTypeList(this.user.jwt).then(feeTypeList => {
            this.feeTypeList = feeTypeList;
            this.selectedFeeType = this.feeTypeList[0];
            this.handleSelectedFeeTypeChange();
        });
    }

    handleSelectedFeeTypeChange(): void {
        this.currentFeeDefinition = {};
        this.currentFeeDefinition['feeTypeDbId'] = this.selectedFeeType.dbId;
        this.currentFeeDefinition['feeType'] = this.selectedFeeType.name;
        this.currentFeeDefinition['filterType'] = this.filterTypeList[0];
        this.currentFeeDefinition['frequency'] = this.frequencyList[0];
        this.currentFeeDefinition['rte'] = true;
        this.currentFeeDefinition['amount'] = 0;
    }

}
