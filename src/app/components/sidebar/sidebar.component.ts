import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../classes/user';

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
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    @Input() user: User;

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

  activate(code: string) {
      console.log(code);
      this.user.appSection = code;
  }

  logout() {
      localStorage.setItem('schoolJWT', '');
      this.user.jwt = '';
      this.user.isAuthenticated = false;
      // alert('log out called');
  }
}
