import {Component, OnInit, Input} from '@angular/core';

import {Router, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';

import { EmitterService } from '../../services/emitter.service';

import {User} from '../../classes/user';
import {style, state, trigger, animate, transition} from "@angular/animations";
import {Student} from '../../classes/student';

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

})
export class SidebarComponent implements OnInit {

    @Input() user: User;

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

    constructor(private router: Router) {
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
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    changePage(task: any, module: any) {
        this.user.populateSection(task, module);
        if (this.user.section.route == 'expenses' || this.user.section.route == 'enquiries') {
            this.router.navigateByUrl(this.user.section.route+'/'+this.user.section.subRoute);
        } else {
            this.router.navigateByUrl(this.user.section.route);
        }
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
