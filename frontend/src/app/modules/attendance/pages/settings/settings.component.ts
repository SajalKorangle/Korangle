import { Component, OnInit } from '@angular/core';
// import { User } from 'app/classes/user';
import { SchoolService } from '../../../../services/modules/school/school.service';
import {UserService} from "../../../../services/modules/user/user.service";
import {DataStorage} from "../../../../classes/data-storage";
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [ SchoolService, UserService, AttendanceService ],
})
  

export class SettingsComponent{
    
    user: any;
    sentUpdateList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    selectedUpdateType: any;
    currentUpdateType = null;

    sentUpdateToList = [
        'All Students',
        'Only Absent Students'
    ];
    
    selectedUpdateTo: any;
    currentUpdateToType = null;

    isInitialLoading = false;


    constructor ( public schoolService: SchoolService,
                public userService: UserService,
                public attendanceService: AttendanceService
                ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.isInitialLoading = true;

        Promise.all([
            this.attendanceService.getObject(this.attendanceService.attendance_settings, {
                'id': this.user.activeSchool.dbId,})
        ]).then(value => {
            // console.log(value);
            this.isInitialLoading = false;
        }, error => {
            this.isInitialLoading = false;
        });
        // this.updateSettings();
    }

    updateSettings(): any{
        console.log(this.currentUpdateType);
        console.log(this.currentUpdateToType);
        if (this.currentUpdateType === null) {
            alert('Select Send Via Type');
            return;
        }
        if (this.currentUpdateToType === null) {
            alert('Select Send Update To Type');
            return;
        }
        Promise.all([
            this.attendanceService.updateObject(this.attendanceService.attendance_settings, {
                'parentSchool': this.user.activeSchool,
                'sentUpdateType': this.currentUpdateType,
                'sentUpdateToType': this.currentUpdateToType
            })
        ]).then(value => {
            // console.log(value);
            this.isInitialLoading = false;
        }, error => {
            this.isInitialLoading = false;
        });
        
    }

    
}