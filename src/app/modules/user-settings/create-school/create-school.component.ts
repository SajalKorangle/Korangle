import { Component, Input, OnInit } from '@angular/core';

import { UserSettingsService } from '../user-settings.service';
import { SchoolService } from '../../../services/school.service';
import { EmployeeService } from '../../employee/employee.service';
import {CreateSchoolServiceAdapter} from './create-school.service.adapter';
import {MEDIUM_LIST} from '../../../classes/constants/medium';
import {TeamService} from '../../team/team.service';

@Component({
  selector: 'create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css'],
    providers: [ SchoolService, EmployeeService, TeamService ],
})

export class CreateSchoolComponent implements OnInit {

    @Input() user;

    mediumList = MEDIUM_LIST;

    schoolProfile: any;

    moduleList: any;

    serviceAdapter: CreateSchoolServiceAdapter;

    isLoading = false;

    constructor (public schoolService: SchoolService,
                 public employeeService: EmployeeService,
                 public teamService: TeamService) { }

    ngOnInit(): void {
        this.schoolProfile = {};
        this.serviceAdapter = new CreateSchoolServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getModuleList();
    }

}
