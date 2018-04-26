import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../classes/user';
import {style, state, trigger, animate, transition} from "@angular/animations";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'students', title: 'Students',  icon: 'account_circle', class: '' },
    { path: 'fees', title: 'Fees',  icon: 'dashboard', class: '' },
    { path: 'expenses', title: 'Expenses', icon: 'dashboard', class: '' },
    { path: 'concession', title: 'Concession', icon: 'dashboard', class: '' },
    { path: 'new_student', title: 'New Student', icon: 'person', class: '' },
    /*{ path: 'user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: 'table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: 'icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: 'upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
    { path: 'fees-receipts', title: 'Fees Receipts',  icon:'content_paste', class: '' },
    { path: 'student-list', title: 'Student List',  icon:'content_paste', class: '' }, */
];

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

    parentPath = '';

  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  activate(section: any) {
      // console.log(code);
      if ( section.subsection.length === 0 ) {
          this.user.appSection = section.path;
          this.parentPath = section.path;
      } else {
          section.showSubsection = !section.showSubsection;
      }
  }

  activateSubsection(subsection: any, section: any) {
      // console.log(subsection);
      this.user.appSection = subsection.path;
      this.parentPath = section.path;
  }

  logout() {
      localStorage.setItem('schoolJWT', '');
      this.user.jwt = '';
      this.user.isAuthenticated = false;
      // alert('log out called');
  }
}
