import { Component, OnInit } from '@angular/core';
// import { User } from 'app/classes/user';
import { SchoolService } from '../../../../services/modules/school/school.service';
import {UserService} from "../../../../services/modules/user/user.service";
import {DataStorage} from "../../../../classes/data-storage";
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';
import { SettingsServiceAdapter } from './settings.service.adapter'
import { Settings } from "../../../../services/modules/attendance/models/settings";
 
@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [ SchoolService, UserService, AttendanceService ],
})
  

export class SettingsComponent{
    
    user: any;
    sentUpdateList = [
        'NULL',
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    receiverList = [
        'All Students',
        'Only Absent Students'
    ];

    isLoading = false;

    selectedSettings: Settings;
    currentSettings: Settings;

    serviceAdapter: SettingsServiceAdapter

    constructor ( public schoolService: SchoolService,
                public userService: UserService,
                public attendanceService: AttendanceService
                ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.currentSettings = new Settings;
        this.selectedSettings = new Settings;
        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData()
        
    }

    isSettingsChanged(): boolean {
        return !(this.currentSettings.sentUpdateType == this.selectedSettings.sentUpdateType
        && this.currentSettings.receiverType == this.selectedSettings.receiverType);
        }
    
}