import { Component, Input, OnInit } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";

import { ClassService } from '../../../services/class.service';
import { FeeService } from '../../fee.service';
import {FeeDefinition} from '../../classes/fee-definition';
import {BusStopService} from '../../../services/bus-stop.service';

@Component({
    selector: 'app-set-school-fees',
    templateUrl: './set-school-fees.component.html',
    styleUrls: ['./set-school-fees.component.css'],
    providers: [ ClassService, BusStopService, FeeService ],
    animations: [
        trigger('rotate', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('true => false', animate('400ms ease')),
            transition('false => true', animate('400ms ease'))
        ]),
        trigger('slideDown', [
            state('true', style({height: '*'})),
            state('false', style({height: 0, overflow: 'hidden'})),
            transition('true => false', animate('800ms ease')),
            transition('false => true', animate('800ms ease'))
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

    classList: any;

    busStopList: any;

    feeTypeList: any;

    currentFeeDefinition: FeeDefinition;

    isLoading = false;

    constructor (private classService: ClassService,
                 private busStopService: BusStopService,
                 private feeService: FeeService) { }

    ngOnInit(): void {
        this.classService.getClassList(this.user.jwt).then( classList => {
            this.classList = classList
        });
        const data = {
            schoolDbId: this.user.schoolDbId,
        };
        this.busStopService.getBusStopList(data, this.user.jwt).then(busStopList => {
            this.busStopList = busStopList;
        });
        this.feeService.getFeeTypeList(this.user.jwt).then(feeTypeList => {
            this.feeTypeList = feeTypeList;
            this.selectedFeeType = this.feeTypeList[0];
            this.handleSelectedFeeTypeChange();
        });
    }

    handleSelectedFeeTypeChange(): void {
        this.currentFeeDefinition = new FeeDefinition();
        this.currentFeeDefinition['feeTypeDbId'] = this.selectedFeeType.dbId;
        this.currentFeeDefinition['feeType'] = this.selectedFeeType.name;
        this.currentFeeDefinition['filterType'] = this.filterTypeList[0];
        this.currentFeeDefinition['frequency'] = this.frequencyList[0];
        this.currentFeeDefinition['rte'] = true;
        this.currentFeeDefinition.populateAllLists(this.classList, this.busStopList);
    }

}
