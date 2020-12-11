import {Component, OnInit, Input} from '@angular/core';

import {Router, NavigationStart, NavigationEnd, NavigationCancel, ActivationStart} from '@angular/router';

import { EmitterService } from '../../services/emitter.service';

import {User} from '../../classes/user';
import {style, state, trigger, animate, transition} from "@angular/animations";
import {SchoolService} from "../../services/modules/school/school.service"
import {environment} from "../../../environments/environment";
import {Constants} from "../../classes/constants";
import { CommonFunctions} from './../../classes/common-functions'
import {NotificationService} from "../../services/modules/notification/notification.service";
import {unregisterForNotification} from '../../classes/common.js';


declare const $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [NotificationService,SchoolService],
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

})
export class SidebarComponent implements OnInit {

    @Input() user: User;

    green = 'green';
    warning = 'warning';
    session_list = [];

    constructor(private router: Router,
                private notificationService: NotificationService,
                private schoolService : SchoolService) {

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
        };

    }




    ngOnInit() {
        this.router.events
            .subscribe((event) => {
                if(event instanceof NavigationStart) {
                    this.user.isLazyLoading = true;
                    if (event.navigationTrigger == "popstate") {
                        if (event.url == '/') {
                            history.back();
                            return;
                        }
                        this.user.initializeTask();
                        }
                    }
                else if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationCancel
                ) {
                    this.user.isLazyLoading = false;
                }
                else if (event instanceof ActivationStart) {
                    CommonFunctions.scrollToTop();
                }
            });
        this.schoolService.getObjectList(this.schoolService.session,{})
            .then(value=>{
                this.session_list = value;
            })
        EmitterService.get('initialize-router').subscribe(value => {
            if(this.user.activeSchool.role == 'Parent' && value.student.id!=undefined && this.user.section.subRoute!='view_fee'){
                 this.router.navigateByUrl(this.router.createUrlTree([this.user.section.route + '/' + this.user.section.subRoute], {
                queryParams: {
                    school_id: this.user.activeSchool.dbId,
                    session: this.user.activeSchool.currentSessionDbId,
                    student_id:value.student.id
                }
            }));
            }else
            {
                this.router.navigateByUrl(this.router.createUrlTree([this.user.section.route+'/'+this.user.section.subRoute],{queryParams:{school_id: this.user.activeSchool.dbId,session:this.user.activeSchool.currentSessionDbId}}));
            }
        });
    }


    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    changePage(task: any, module: any) {
        if (!this.user.checkAuthentication()) {
            alert("Authentication failed");
        } else {
            this.user.populateSection(task, module);
            if(this.user.activeSchool.role == 'Parent' && module.name!=undefined && task.path!='view_fee'){ // view fee is common for all students in the case of multiple students
                this.router.navigateByUrl(this.router.createUrlTree([this.user.section.route + '/' + this.user.section.subRoute], {
                queryParams: {
                    school_id: this.user.activeSchool.dbId,
                    session: this.user.activeSchool.currentSessionDbId,
                    student_id:module.id  // the if case is for this param , if  student's task then student id must be a param
                }
            }));
            }else {
                this.router.navigateByUrl(this.router.createUrlTree([this.user.section.route + '/' + this.user.section.subRoute], {
                    queryParams: {
                        school_id: this.user.activeSchool.dbId,
                        session: this.user.activeSchool.currentSessionDbId
                    }
                }));
            }
            EmitterService.get('close-sidebar').emit();
        }
    }


    handleSessionChange(){
        this.router.navigateByUrl('');
        setTimeout(()=>{
            this.user.initializeTask();
        });
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
        unregisterForNotification({
            'jwt': this.user.jwt,
            'url': environment.DJANGO_SERVER + Constants.api_version + this.notificationService.module_url + this.notificationService.gcm_device,
        });
        localStorage.setItem('schoolJWT', '');
        this.user.isAuthenticated = false;
        this.user.jwt = '';
        this.user.emptyUserDetails();
    }

}
