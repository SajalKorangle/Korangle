import { Component, Input, OnInit } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";

import { FeeService } from '../../fee.service';


import { FREQUENCY_LIST } from '../../classes/constants';

@Component({
    selector: 'app-approve-fees',
    templateUrl: './approve-fees.component.html',
    styleUrls: ['./approve-fees.component.css'],
    providers: [ FeeService ],
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

export class ApproveFeesComponent implements OnInit {

    @Input() user;

    frequencyList: any;

    feeStructure: any;

    selectedFeeDefinition: any;

    isLoading = false;

    constructor (private feeService: FeeService) { }

    ngOnInit(): void {

        this.frequencyList = FREQUENCY_LIST;

        let feeStructureData = {
            'schoolDbId': this.user.activeSchool.dbId,
            'sessionDbId': this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;
        this.feeService.getFeeStructure(feeStructureData, this.user.jwt).then(feeStructure => {
            this.isLoading = false;
            this.feeStructure = feeStructure;
            if (this.feeStructure.length > 0) {
                this.selectedFeeDefinition = this.feeStructure[0];
            } else {
                this.selectedFeeDefinition = null;
            }
        }, error => {
            this.isLoading = false;
        });

    }

    lockFeeDefinition(): void {
        let data = {
            'dbId': this.selectedFeeDefinition.dbId,
        };
        this.isLoading = true;
        this.feeService.lockFeeDefinition(data,this.user.jwt).then(message=>{
            this.isLoading = false;
            alert(message);
            this.feeStructure.every(feeDefinition => {
                if (feeDefinition.dbId === data['dbId']) {
                    feeDefinition.locked = true;
                    return false;
                }
                return true;
            })
        }, error => {
            this.isLoading = false;
        });
    }

}
