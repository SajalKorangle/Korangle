import {Component, Input, OnInit} from '@angular/core';

import { AttendanceService } from '../../attendance.service';

import { TeamService } from '../../../team/team.service';

import { ClassService } from '../../../../services/class.service';

import 'rxjs/add/operator/toPromise';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'give-permissions',
  templateUrl: './give-permissions.component.html',
  styleUrls: ['./give-permissions.component.css'],
    providers: [ TeamService, AttendanceService, ClassService ],
})

export class GivePermissionsComponent implements OnInit {

    @Input() user;

    memberList = [];
    moduleList = [];

    selectedClass: any;

    classSectionList = [];

    filteredMemberList: any;

    myControl = new FormControl();

    selectedMember: any;
    selectedMemberAttendancePermissionList: any;

    isLoading = false;

    constructor (private teamService: TeamService,
                 private attendanceService: AttendanceService,
                 private classService: ClassService) { }

    ngOnInit() {

        let request_member_data = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        const request_class_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;

        Promise.all([
            this.teamService.getSchoolMemberList(request_member_data, this.user.jwt),
            this.classService.getClassSectionList(request_class_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeMemberList(value[0]);
            this.initializeClassSectionList(value[1]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeMemberList(memberList: any): void {
        this.memberList = memberList;
        this.filteredMemberList = this.myControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).username),
            map(value => this.filter(value))
        );
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach( classs => {
            classs.selectedSection = classs.sectionList[0];
        });
        this.selectedClass = this.classSectionList[0];
    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.memberList.filter( member => member.username.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(member?: any) {
        if (member) {
            return member.username;
        } else {
            return '';
        }
    }

    getMemberAttendancePermissionList(member: any): void {

        let data = {
            parentSchool: this.user.activeSchool.dbId,
            parentUser: member.userDbId,
            sessionId: this.user.activeSchool.currentSessionDbId,
        };
        this.selectedMember = member;
        this.selectedMemberAttendancePermissionList = null;
        this.isLoading = true;
        this.attendanceService.getAttendancePermissionList(data, this.user.jwt).then( attendancePermissionList => {
            this.isLoading = false;
            this.selectedMemberAttendancePermissionList = attendancePermissionList;
        }, error => {
            this.isLoading = false;
        });

    }

    showAddButton(): boolean {
        let result = true;
        this.selectedMemberAttendancePermissionList.every(attendancePermission => {
            if (attendancePermission.parentSection === this.selectedClass.selectedSection.dbId) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    showClassSectionName(sectionDbId: number): any {
        let result = '';
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (section.dbId === sectionDbId) {
                    result = classs.name + ', ' + section.name;
                    return false;
                }
                return true;
            });
            if (result !== '') {
                return false;
            }
            return true;
        });
        return result;
    }

    addAttendancePermission(): void {

        let data = {
            parentUser: this.selectedMember.userDbId,
            parentSchool: this.user.activeSchool.dbId,
            parentSection: this.selectedClass.selectedSection.dbId,
        };

        this.isLoading = true;

        this.attendanceService.giveAttendancePermission(data, this.user.jwt).then(result => {
            alert(result.message);
            if (result.status === 'success') {
                this.selectedMemberAttendancePermissionList.push(result.data);
            }
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });

    }

    deleteAttendancePermission(attendancePermission: any): void {

        let data = {
            id: attendancePermission.id,
        };

        this.isLoading = true;

        this.attendanceService.deleteAttendancePermission(data, this.user.jwt).then(result => {
            alert(result);
            this.removeFromAttendancePermissionList(data['id']);
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });

    }

    removeFromAttendancePermissionList(id: number): void {
        let index = 0;
        this.selectedMemberAttendancePermissionList.every(attendancePermission => {
            if (attendancePermission.id === id) {
                return false;
            }
            ++index;
            return true;
        });
        this.selectedMemberAttendancePermissionList.splice(index, 1);
    }

}
