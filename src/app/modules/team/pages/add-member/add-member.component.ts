import {Component, Input, OnInit } from '@angular/core';

import { TeamService } from '../../team.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/internal/operators/map';

@Component({
  selector: 'add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
    providers: [ TeamService ],
})

export class AddMemberComponent implements OnInit {

    @Input() user;

    memberList = [];
    moduleList = [];
    userList = [];

    filteredUserList: any;

    myControl = new FormControl();

    selectedUser: any;

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
            this.teamService.getUserList(this.user.jwt),
        ]).then(value => {
            console.log(value);
            this.isLoading = false;
            this.memberList = value[0];
            this.moduleList = value[1];
            this.initializeModulePermissions();
            this.initializeUserList(value[2]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeUserList(userList: any): void {
        this.userList = userList;
        this.filteredUserList = this.myControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).username),
            map(value => this.filter(value))
        );
    }

    initializeModulePermissions(): void {
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                task.selected = false;
            })
        })
    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.userList.filter( user => user.username.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(user?: any) {
        if (user) {
            return user.username;
        } else {
            return '';
        }
    }

    selectUser(userDbId: any): void {
        this.userList.every(user => {
            if (user.dbId === userDbId) {
                this.selectedUser = user;
                return false;
            }
            return true;
        });
    }

    handleSelectedUser(user: any): void {
        // this.selectUser(user.dbId);
        this.selectedUser = user;
        if (this.inMemberList(user)) {
            this.selectedUser.isMember = true;
        } else {
            this.selectedUser.isMember = false;
        }
        this.initializeModulePermissions();
    }

    inMemberList(user: any): boolean {
        let result = false;
        this.memberList.every(member => {
            if (member.userDbId === user.dbId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    addMember(): void {

        let data = {
            userDbId: this.selectedUser.dbId,
            schoolDbId: this.user.activeSchool.dbId,
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

        let userName = this.selectedUser.username;

        this.isLoading = true;
        this.teamService.createMember(data, this.user.jwt).then( message => {
            this.isLoading = false;
            alert(message);
            if (this.selectedUser.dbId === data['userDbId']) {
                this.selectedUser.isMember = true;
            }
            let user = {
                dbId: data['userDbId'],
                username: userName,
            };
            this.memberList.push(user);
        }, error => {
            this.isLoading = false;
        });

    }

}
