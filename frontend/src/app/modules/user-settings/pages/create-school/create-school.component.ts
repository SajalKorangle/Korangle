import { Component, OnInit } from '@angular/core';

import { SchoolOldService } from '../../../../services/modules/school/school-old.service';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { CreateSchoolServiceAdapter } from './create-school.service.adapter';
import { MEDIUM_LIST } from '../../../../classes/constants/medium';
import { DataStorage } from '../../../../classes/data-storage';
import { TeamService } from '../../../../services/modules/team/team.service';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { PincodeService } from '../../../../services/pincode.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
    selector: 'create-school',
    templateUrl: './create-school.component.html',
    styleUrls: ['./create-school.component.css'],
    providers: [SchoolOldService, EmployeeOldService, TeamService, SchoolService, PincodeService],
})
export class CreateSchoolComponent implements OnInit {
    user;

    mediumList = MEDIUM_LIST;
    boardList: any;

    schoolProfile: any;

    moduleList: any;

    villageCityFormControl = new FormControl();
    blockFormControl = new FormControl();
    districtFormControl = new FormControl();
    stateFormControl = new FormControl();

    filteredVillageCityList: any;
    filteredBlockList: any;
    filteredDistrictList: any;
    filteredStateList: any;

    villageCityList = [];
    blockList = [];
    districtList = [];
    stateList = [];

    serviceAdapter: CreateSchoolServiceAdapter;

    isLoading = false;

    constructor(
        public schoolOldService: SchoolOldService,
        public employeeService: EmployeeOldService,
        public schoolService: SchoolService,
        public pincodeService: PincodeService,
        public teamService: TeamService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.schoolProfile = {};
        this.serviceAdapter = new CreateSchoolServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.filteredVillageCityList = this.villageCityFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any))),
            map((value) => this.filterList(value, this.villageCityList))
        );

        this.filteredBlockList = this.blockFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : '')),
            map((value) => this.filterList(value, this.blockList))
        );

        this.filteredDistrictList = this.districtFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : '')),
            map((value) => this.filterList(value, this.districtList))
        );

        this.filteredStateList = this.stateFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : '')),
            map((value) => this.filterList(value, this.stateList))
        );
    }

    filterList(value: string, list: any): any {
        if (value === null || value === '') {
            return [];
        }
        let filteredList = list.filter((item) => {
            return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
        });
        return filteredList;
    }

    displayListFunction(value?: any): any {
        if (value) {
            return value;
        }
        return '';
    }

    displayFunction(value: any): any {
        if (value) {
            return value;
        }
        return '';
    }

    getAffiliationPlaceholder(): any {
        if (this.schoolProfile.parentBoard == this.boardList[0].id) {
            return 'School Code';
        } else if (this.schoolProfile.parentBoard == this.boardList[1].id) {
            return 'Affiliation No.';
        }
    }
}
