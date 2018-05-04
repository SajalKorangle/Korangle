import { Component, Input, OnInit } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";

// import 'rxjs/add/operator/toPromise';

import { ClassService } from '../../../services/class.service';
import { FeeService } from '../../fee.service';
import {FeeDefinition} from '../../classes/fee-definition';
import {BusStopService} from '../../../services/bus-stop.service';

import { SchoolFeeComponent } from '../../classes/school-fee-component';

import { FREQUENCY_LIST } from '../../classes/constants';

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

    selectedFeeType: any;

    frequencyList: any;

    classList: any;

    busStopList: any;

    feeStructure: any;

    feeTypeList: any;

    selectedFeeDefinition: any;
    currentFeeDefinition: FeeDefinition;

    selectedSchoolFeeComponent: any;
    currentSchoolFeeComponent: SchoolFeeComponent;

    isLoading = false;

    constructor (private classService: ClassService,
                 private busStopService: BusStopService,
                 private feeService: FeeService) { }

    ngOnInit(): void {

        this.currentFeeDefinition = new FeeDefinition();
        this.currentSchoolFeeComponent = new SchoolFeeComponent();

        this.frequencyList = FREQUENCY_LIST;

        this.classService.getClassList(this.user.jwt).then( classList => {
            this.classList = classList;
        });

        let data = {
            schoolDbId: this.user.schoolDbId,
        };
        this.busStopService.getBusStopList(data, this.user.jwt).then(busStopList => {
            this.busStopList = busStopList;
        });

        let feeStructureData = {
            'schoolDbId': this.user.schoolDbId,
            'sessionDbId': this.user.schoolCurrentSessionDbId,
        };

        this.isLoading = true;
        Promise.all([
            this.feeService.getFeeStructure(feeStructureData, this.user.jwt),
            this.feeService.getFeeTypeList(this.user.jwt)]
        ).then( value => {
            this.isLoading = false;
            this.feeStructure = value[0];
            this.feeTypeList = value[1];
            this.selectedFeeType = this.feeTypeList[0];
            this.populateFeeDefinition();
        }, error => {
            this.isLoading = false;
        });

    }

    populateFeeDefinition(): void {

        let check = true;

        this.feeStructure.forEach(feeDefinition => {
            if (feeDefinition.feeTypeDbId === this.selectedFeeType.dbId) {
                this.selectedFeeDefinition = feeDefinition;
                this.currentFeeDefinition.fromServerObject(feeDefinition);
                if (feeDefinition.schoolFeeComponentList.length > 0) {
                    this.populateSchoolFeeComponent(feeDefinition.schoolFeeComponentList[0]);
                } else {
                    this.populateSchoolFeeComponent(undefined);
                }
                check = false;
                return;
            }
        });

        if (check) {
            this.currentFeeDefinition = new FeeDefinition();
            this.selectedFeeDefinition = this.currentFeeDefinition;
            this.currentFeeDefinition['feeTypeDbId'] = this.selectedFeeType.dbId;
            this.currentFeeDefinition['feeType'] = this.selectedFeeType.name;
        }

    }

    populateSchoolFeeComponent(event: any): void {
        if (event === undefined) {
            this.currentSchoolFeeComponent = new SchoolFeeComponent();
            this.selectedSchoolFeeComponent = this.currentSchoolFeeComponent;
        } else {
            this.selectedSchoolFeeComponent = event;
            this.currentSchoolFeeComponent.fromServerObject(event);
        }
    }


    // Fee Definition Server Actions

    createFeeDefinition(): void {
        this.isLoading = true;
        this.feeService.createFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.schoolDbId, this.user.schoolCurrentSessionDbId),
            this.user.jwt).then( response => {
                this.isLoading = false;
                alert(response['message']);
                if (response['status'] === 'success') {
                    response['feeDefinition']['schoolFeeComponentList'] = [];
                    this.feeStructure.push(response['feeDefinition']);
                }
                this.populateFeeDefinition();
        }, error => {
                this.isLoading = false;
        });
    }

    updateFeeDefinition(): void {
        this.isLoading = true;
        this.feeService.updateFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.schoolDbId, this.user.schoolCurrentSessionDbId),
            this.user.jwt).then( response => {
                this.isLoading = false;
                alert(response['message']);
                if (response['status'] === 'success') {
                    response['feeDefinition']['schoolFeeComponentList'] = [];
                    let index, count=0;
                    this.feeStructure.forEach(feeDefinition => {
                        if (feeDefinition.dbId === response['feeDefinition']['dbId']) {
                            index = count;
                        }
                        ++count;
                    });
                    this.feeStructure.splice(index,1);
                    this.feeStructure.push(response['feeDefinition']);
                }
                this.populateFeeDefinition();
        }, error => {
                this.isLoading = false;
        });
    }

    deleteFeeDefinition(): void {
        this.isLoading = true;
        this.feeService.deleteFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.schoolDbId, this.user.schoolCurrentSessionDbId),
            this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response['message']);
            if (response['status'] === 'success') {
                let index, count=0;
                this.feeStructure.forEach(feeDefinition => {
                    if (feeDefinition.dbId === response['feeDefinitionDbId']) {
                        index = count;
                    }
                    ++count;
                });
                this.feeStructure.splice(index,1);
            }
            this.populateFeeDefinition();
        }, error => {
            this.isLoading = false;
        });
    }


    // School Fee Component Server Actions

    createSchoolFeeComponent(): void {
        alert('Functionality yet to be implemented');
    }

    updateSchoolFeeComponent(): void {
        alert('Functionality yet to be implemented');
    }

    deleteSchoolFeeComponent(): void {
        alert('Functionality yet to be implemented');
    }

}
