import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';

import { User } from '../../classes/user';
import {style, state, trigger, animate, transition} from "@angular/animations";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

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

  constructor(private router: Router) { }

  ngOnInit() {
      this.router.navigateByUrl('/');
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  activate(section: any) {
      // console.log(code);
      if (section.path === 'employee') {
          this.user.appSection = section.path;
          this.parentPath = section.path;
          return;
      } else {
          this.router.navigateByUrl('/');
      }
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
