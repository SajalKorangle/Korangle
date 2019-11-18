import { Component, Input, OnInit } from '@angular/core';

import { SchoolOldService } from '../../../../services/modules/school/school-old.service';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import {CreateSchoolServiceAdapter} from './create-school.service.adapter';
import {MEDIUM_LIST} from '../../../../classes/constants/medium';
import {BOARD_LIST} from "../../../../classes/constants/board";
import {DataStorage} from "../../../../classes/data-storage";
import {TeamService} from "../../../../services/modules/team/team.service";
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
  selector: 'create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css'],
    providers: [ SchoolOldService, EmployeeOldService, TeamService, SchoolService ],
})

export class CreateSchoolComponent implements OnInit {

    user;

    mediumList = MEDIUM_LIST;
    boardList: any;

    schoolProfile: any;

    moduleList: any;

    serviceAdapter: CreateSchoolServiceAdapter;

    isLoading = false;

    constructor (public schoolOldService: SchoolOldService,
                 public employeeService: EmployeeOldService,
                 public schoolService: SchoolService,
                 public teamService: TeamService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.schoolProfile = {};
        this.serviceAdapter = new CreateSchoolServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
