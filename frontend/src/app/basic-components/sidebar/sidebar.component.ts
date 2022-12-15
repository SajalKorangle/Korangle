import { Component, OnInit, Input, HostListener } from '@angular/core';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, ActivationStart } from '@angular/router';

import { EmitterService } from '../../services/emitter.service';

import { User } from '../../classes/user';
import { style, state, trigger, animate, transition } from '@angular/animations';
import { GenericService } from '@services/generic/generic-service';
import { environment } from '../../../environments/environment';
import { Constants } from '../../classes/constants';
import { CommonFunctions } from './../../classes/common-functions';
import { NotificationService } from '../../services/modules/notification/notification.service';
import { unregisterForNotification } from '../../classes/common.js';
import { Query } from '@services/generic/query';

declare const $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [
        NotificationService,
        GenericService,
    ],
    animations: [
        trigger('rotate', [
            state('true', style({ transform: 'rotate(0deg)' })),
            state('false', style({ transform: 'rotate(180deg)' })),
            transition('true => false', animate('400ms ease-out')),
            transition('false => true', animate('400ms ease-in')),
        ]),
        trigger('slideDown', [
            state('true', style({ maxHeight: 200 })),
            state('false', style({ maxHeight: 0, overflow: 'hidden' })),
            transition('true => false', animate('800ms ease-out')),
            transition('false => true', animate('800ms ease-in')),
        ]),
    ],
})
export class SidebarComponent implements OnInit {
    @Input() user: User;

    green = 'green';
    warning = 'warning';
    session_list = [];

    constructor(
        private router: Router,
        private notificationService: NotificationService,
        private genericService: GenericService
    ) {
        // We are using this routeReuseStrategy because the DashBoard Component should not re-render when changing pages.
        this.router.routeReuseStrategy.shouldReuseRoute = function (future: any, curr: any) {
            return (curr.routeConfig === future.routeConfig) || future.data.reuse;
        };
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        if (window.location.pathname == '/') {
            history.back();
            return;
        }
        this.user.initializeTask();
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.user.isLazyLoading = true;
            } else if (event instanceof NavigationCancel) {
                this.user.isLazyLoading = false;
            } else if (event instanceof NavigationEnd) {
                this.user.isLazyLoading = false;
                if (this.router.url != '/') {
                    (<any>window).ga('set', 'page', event.urlAfterRedirects);
                    (<any>window).ga('send', 'pageview');
                }
            } else if (event instanceof ActivationStart) {
                CommonFunctions.scrollToTop();
            }
        });
        this.genericService.getObjectList({school_app: 'Session'}, {}).then((value) => {
            this.session_list = value;
        });
        EmitterService.get('initialize-router').subscribe((value) => {
            // Navigating To '/' before any other route - because :
            // We have used routeReuseStrategy so if the url is same the page won't reload,
            // To overcome that case we are navigating to '/' first and then the corresponding route.
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigateByUrl(
                    this.router.createUrlTree([Constants.dashBoardRoute + '/' + this.user.section.route + '/' + this.user.section.subRoute],
                        {queryParams: value.queryParams})
                );
            });
        });
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    changePage(task: any, module: any) {
        this.user.populateSectionAndRoute(task, module);
        EmitterService.get('close-sidebar').emit();
    }

    handleSessionChange() {
        this.router.navigateByUrl('');
        setTimeout(() => {
            this.user.initializeTask();
        });
    }

    handleSchoolChange(): void {
        this.router.navigateByUrl('');
        setTimeout(() => {
            this.user.initializeTask();
        });
    }

    handleRoleChange(): void {
        this.router.navigateByUrl('');
        setTimeout(() => {
            this.user.initializeTask();
        });
    }

    getFirstName(value: string): string {
        if (!value) {
            return '';
        }
        return value.split(' ')[0];
    }

    async logout() {

        // Starts: Removing device's token ( current logn instance ) from Device List
        const deleteResponsePromise = new Query()
            .filter({ token: this.user.jwt })
            .deleteObjectList({ authentication_app: 'DeviceList' });
        // Ends: Removing device's token ( current logn instance ) from Device List

        unregisterForNotification({
            jwt: this.user.jwt,
            url:
                environment.DJANGO_SERVER +
                Constants.api_version +
                this.notificationService.module_url +
                this.notificationService.gcm_device,
        });
        localStorage.setItem('schoolJWT', '');
        this.user.isAuthenticated = false;
        this.user.jwt = '';
        this.user.emptyUserDetails();
        this.router.navigate(['login']);
    }

    getCurrentSession(): any {
        return this.session_list.find(session => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        });
    }

}
