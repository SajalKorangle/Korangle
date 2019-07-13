import {Component, OnInit, Input} from '@angular/core';

import {Router, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';

import { EmitterService } from '../../services/emitter.service';

import {User} from '../../classes/user';
import {style, state, trigger, animate, transition} from "@angular/animations";
import {Student} from '../../classes/student';
import {TeamService} from "../../modules/team/team.service";
import {SchoolService} from "../../services/school.service";
import {logger} from "codelyzer/util/logger";

declare const $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    animations: [
        trigger('rotate', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('true => false', animate('400ms ease-out')),
            transition('false => true', animate('400ms ease-in'))
        ]),
        trigger('slideDown', [
            state('true', style({maxHeight: 200})),
            state('false', style({maxHeight: 0, overflow: 'hidden'})),
            transition('true => false', animate('800ms ease-out')),
            transition('false => true', animate('800ms ease-in'))
        ]),
    ],
    providers: [ TeamService ],


})
export class SidebarComponent implements OnInit {

    @Input() user: User;
    sessionChangePermission=false;
    moduleList=[];
    green = 'green';
    warning = 'warning';

    settings = {
        path: 'user-settings',
        title: 'Settings',
        icon: 'settings',
        showTaskList: false,
        taskList: [
            {
                path: 'update_profile',
                title: 'Update Profile',
            },
            {
                path: 'change_password',
                title: 'Change Password',
            },
            {
                path: 'contact_us',
                title: 'Contact Us',
            },
            {
                path: 'create_school',
                title: 'Create School',
            }
        ],
    };

    constructor(private router: Router,
                private teamService:TeamService) {
    }

    ngOnInit() {
        this.router.events
            .subscribe((event) => {
                if(event instanceof NavigationStart) {
                    this.user.isLazyLoading = true;
                }
                else if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationCancel
                ) {
                    this.user.isLazyLoading = false;
                }
            });
        EmitterService.get('initialize-router').subscribe(value => {
            this.router.navigateByUrl(this.user.section.route);
        });
        if (this.user.section) {
            this.router.navigateByUrl(this.user.section.route);
        }

        this.handleChangeSession();
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    handleChangeSession(){
        console.log("usre",this.user['activeSchool']);
            const request_module_data = {
                schoolDbId: this.user.activeSchool.dbId,
            };
            console.log('hrere');
            Promise.all([
                this.teamService.getSchoolModuleList(request_module_data, this.user.jwt),
            ]).then(value => {
                // console.log(value);
                console.log('hrere22');

                this.sessionChangePermission=true;
                this.moduleList=value[0];
                //no need for checkPermission??
                this.checkPermission(this.moduleList)
            }, error => {
                console.log('error changing session');
            });


    }

    checkPermission(moduleArray):void{
        moduleArray.forEach(module=>{
            if(module.path=="school"){
                let taskList=module.taskList;
                taskList.forEach(task=>{
                    if(task.path=="change_session"){
                        console.log('permission is granted!');
                        this.sessionChangePermission=true;
                        // this.permissionEmitter.emit(this.sessionChangePermission);
                    }else{
                        console.log('permission is not granted!');
                    }

                });

            }
        });
    }

    changePage(task: any, module: any) {
        this.user.populateSection(task, module);
        this.router.navigateByUrl(this.user.section.route);
        EmitterService.get('close-sidebar').emit();
    }

    handleSchoolChange(): void {
        this.router.navigateByUrl('');
        setTimeout(()=>{
            this.user.initializeTask();
        });
    }

    handleRoleChange(): void {
        this.router.navigateByUrl('');
        setTimeout(()=> {
            this.user.initializeTask();
        });
    }

    getFirstName(value: string): string {
        if (!value) { return ''; }
        return value.split(' ')[0];
    }

    logout() {
        localStorage.setItem('schoolJWT', '');
        this.user.isAuthenticated = false;
        this.user.jwt = '';
        this.user.emptyUserDetails();
    }

}
