import { Component, Input, OnInit } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";

// import 'rxjs/add/operator/toPromise';

import { ClassService } from '../../../../services/class.service';
import { FeeOldService } from '../../fee-old.service';
import {FeeDefinition} from '../../classes/fee-definition';
import {BusStopService} from '../../../../services/bus-stop.service';

import { SchoolFeeComponent } from '../../classes/school-fee-component';

import { FREQUENCY_LIST } from '../../classes/constants';

@Component({
    selector: 'app-set-school-fees',
    templateUrl: './set-school-fees.component.html',
    styleUrls: ['./set-school-fees.component.css'],
    providers: [ ClassService, BusStopService, FeeOldService ],
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
                 private feeService: FeeOldService) { }

    ngOnInit(): void {

        this.currentFeeDefinition = new FeeDefinition();
        // this.currentSchoolFeeComponent = new SchoolFeeComponent(0);

        this.frequencyList = FREQUENCY_LIST;

        this.classService.getClassList(this.user.jwt).then( classList => {
            this.classList = classList;
        });

        let data = {
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.busStopService.getBusStopList(data, this.user.jwt).then(busStopList => {
            this.busStopList = busStopList;
        });

        let feeStructureData = {
            'schoolDbId': this.user.activeSchool.dbId,
            'sessionDbId': this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;
        Promise.all([
            this.feeService.getFeeStructure(feeStructureData, this.user.jwt),
            this.feeService.getFeeTypeList(this.user.jwt)]
        ).then( value => {
            this.isLoading = false;
            this.feeStructure = value[0];
            console.log(this.feeStructure);
            // this.feeStructure = Array.of(this.feeStructure);
            // console.log(this.feeStructure);
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
                this.currentFeeDefinition.fromServerObject(feeDefinition);
                this.selectedFeeDefinition = feeDefinition;
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
            this.currentSchoolFeeComponent = new SchoolFeeComponent(this.selectedFeeDefinition, this.classList, this.busStopList);
            this.selectedSchoolFeeComponent = this.currentSchoolFeeComponent;
        } else {
            this.currentSchoolFeeComponent = new SchoolFeeComponent(this.selectedFeeDefinition, this.classList, this.busStopList);
            this.currentSchoolFeeComponent.fromServerObject(event);
            this.selectedSchoolFeeComponent = event;
        }
    }


    // Fee Definition Server Actions

    createFeeDefinition(): void {
        this.isLoading = true;
        this.feeService.createFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.activeSchool.dbId, this.user.activeSchool.currentSessionDbId),
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
        this.feeService.updateFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.activeSchool.dbId, this.user.activeSchool.currentSessionDbId),
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
        this.feeService.deleteFeeDefinition(this.currentFeeDefinition.toServerObject(this.user.activeSchool.dbId, this.user.activeSchool.currentSessionDbId),
            this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response['message']);
            if (response['status'] === 'success') {
                let index=0;
                this.feeStructure.every(feeDefinition => {
                    if (feeDefinition.dbId === response['feeDefinitionDbId']) {
                        this.feeStructure.splice(index,1);
                        this.populateFeeDefinition();
                        return false;
                    }
                    ++index;
                    return true;
                });
            }
        }, error => {
            this.isLoading = false;
        });
    }


    // School Fee Component Server Actions

    createSchoolFeeComponent(): void {

        let data = this.currentSchoolFeeComponent.toServerObject();

        if (this.selectedFeeDefinition.classFilter && data.classList.length === 0) {
            alert('Atleast one class should be selected');
            return;
        }
        if (this.selectedFeeDefinition.busStopFilter && data.busStopList.length === 0) {
            alert('Atleast one bus stop should be selected');
            return;
        }
        if (!data.title || data.title === '') {
            alert('"Group Name" should be populated');
            return;
        }
        let sameTitle = false;
        this.selectedFeeDefinition.schoolFeeComponentList.every(schoolFeeComponent => {
            if (schoolFeeComponent.title === data.title) {
                sameTitle = true;
                return false;
            }
            return true;
        });
        if (sameTitle) {
            alert('Title: \''+data.title+'\' have already been used in this fee.');
            return;
        }

        this.isLoading=true;
        this.feeService.createSchoolFeeComponent(data,
            this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Fee Amount declared successfully');
            this.feeStructure.every(feeDefinition => {
                if (feeDefinition.dbId === response.feeDefinitionDbId){
                    feeDefinition.schoolFeeComponentList.push(response);
                    if (feeDefinition.feeTypeDbId === this.selectedFeeType.dbId) {
                        this.populateFeeDefinition();
                        if (feeDefinition.busStopFilter || feeDefinition.classFilter) {
                            this.populateSchoolFeeComponent(undefined);
                        }
                    }
                    return false;
                }
                return true;
            });
        }, error => {
            this.isLoading = false;
        });
    }

    updateSchoolFeeComponent(): void {

        let data = this.currentSchoolFeeComponent.toServerObject();

        if (!data.title || data.title === '') {
            alert('Title should be populated');
            return;
        }
        let sameTitle = false;
        this.selectedFeeDefinition.schoolFeeComponentList.every(schoolFeeComponent => {
            if (schoolFeeComponent.dbId !== data.dbId && schoolFeeComponent.title === data.title) {
                sameTitle = true;
                return false;
            }
            return true;
        });
        if (sameTitle) {
            alert('Title: \''+data.title+'\' have already been used in this fee.');
            return;
        }

        this.isLoading=true;
        this.feeService.updateSchoolFeeComponent(data,
            this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Fee Amount updated successfully');
            this.feeStructure.every(feeDefinition => {
                if (feeDefinition.dbId === response.feeDefinitionDbId){
                    feeDefinition.schoolFeeComponentList.every((schoolFeeComponent, index) => {
                        if (schoolFeeComponent.dbId === response.dbId) {
                            feeDefinition.schoolFeeComponentList.splice(index, 1);
                            feeDefinition.schoolFeeComponentList.push(response);
                            if (feeDefinition.feeTypeDbId === this.selectedFeeType.dbId) {
                                this.populateFeeDefinition();
                                this.populateSchoolFeeComponent(response);
                            }
                            return false;
                        }
                        return true;
                    });
                    return false;
                }
                return true;
            });
        }, error => {
            this.isLoading = false;
        });
    }

    deleteSchoolFeeComponent(): void {

        let data = {
            'dbId': this.currentSchoolFeeComponent.dbId,
            'feeDefinitionDbId': this.currentSchoolFeeComponent.parentFeeDefinition.dbId,
        };

        this.isLoading=true;
        this.feeService.deleteSchoolFeeComponent(data,
            this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Fee Amount declaration deleted successfully');
            this.feeStructure.every(feeDefinition => {
                if (feeDefinition.dbId === data.feeDefinitionDbId){
                    feeDefinition.schoolFeeComponentList.every((schoolFeeComponent, index) => {
                        if (schoolFeeComponent.dbId === response.dbId) {
                            feeDefinition.schoolFeeComponentList.splice(index, 1);
                            if (feeDefinition.feeTypeDbId === this.selectedFeeType.dbId) {
                                this.populateFeeDefinition();
                                this.populateSchoolFeeComponent(undefined);
                            }
                            return false;
                        }
                        return true;
                    });
                    return false;
                }
                return true;
            });
        }, error => {
            this.isLoading = false;
        });
    }

}
