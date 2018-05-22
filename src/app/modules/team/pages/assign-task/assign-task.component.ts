import {Component, Input, OnInit } from '@angular/core';

import { TeamService } from '../../team.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
    providers: [ TeamService ],
})

export class AssignTaskComponent implements OnInit {

    @Input() user;

    memberList = [];
    moduleList = [];

    filteredMemberList: any;

    myControl = new FormControl();

    selectedMember: any;
    selectedMemberPermission: any;

    isLoading = false;

    constructor (private teamService: TeamService) { }

    ngOnInit() {

        let request_member_data = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        let request_module_data = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        Promise.all([
            this.teamService.getSchoolMemberList(request_member_data, this.user.jwt),
            this.teamService.getSchoolModuleList(request_module_data, this.user.jwt),
        ]).then(value => {
            console.log(value);
            this.isLoading = false;
            this.initializeMemberList(value[0]);
            this.initializeModuleList(value[1]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeModuleList(moduleList: any): void {
        this.moduleList = moduleList;
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                task.selected = false;
            })
        })
    }

    initializeMemberList(memberList: any): void {
        this.memberList = memberList;
        this.filteredMemberList = this.myControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).username),
            map(value => this.filter(value))
        );
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

    getMemberPermissionList(member: any): void {
        let data = {
            schoolDbId: this.user.activeSchool.dbId,
            userDbId: member.userDbId,
        };
        this.selectedMember = member;
        this.selectedMemberPermission = null;
        this.isLoading = true;
        this.teamService.getMemberPermissionList(data, this.user.jwt).then( memberPermission => {
            this.isLoading = false;
            this.selectedMemberPermission = memberPermission;
            this.initializeModulePermissions();
        }, error => {
            this.isLoading = false;
        });
    }

    initializeModulePermissions(): void {
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                if (this.inSelectedMemberPermission(task)) {
                    task.selected = true;
                } else {
                    task.selected = false;
                }
            });
        });
    }

    inSelectedMemberPermission(task: any): boolean {
        let result = false;
        this.selectedMemberPermission.every(permission => {
            if (permission.taskDbId === task.dbId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    updatePermissions(): void {
        let data = {
            schoolDbId: this.user.activeSchool.dbId,
            userDbId: this.selectedMember.userDbId,
            permissionList: [],
        };
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                if (task.selected) {
                    let permission = {
                        taskDbId: task.dbId,
                    };
                    data['permissionList'].push(permission);
                }
            });
        });
        this.isLoading = true;
        this.teamService.giveMemberPermissions(data, this.user.jwt).then( message => {
            this.isLoading = false;
            alert(message);
            if (this.selectedMember.userDbId === data.userDbId) {
                this.selectedMemberPermission = data['permissionList'];
                this.initializeModulePermissions();
            }
        }, error => {
            this.isLoading = false;
        });
    }

}
