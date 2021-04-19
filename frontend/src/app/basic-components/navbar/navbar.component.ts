import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
    @Input() user;

    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(location: Location, private element: ElementRef) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        // const navbar: HTMLElement = this.element.nativeElement;
        // this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        EmitterService.get('close-sidebar').subscribe((value) => {
            this.sidebarClose();
        });
    }

    sidebarOpen() {
        // const toggleButton = this.toggleButton;
        const toggleButton = this.element.nativeElement.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        /*setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);*/
        body.classList.add('nav-open');
        toggleButton.classList.add('toggled');

        this.sidebarVisible = true;
    }
    sidebarClose() {
        const toggleButton = this.element.nativeElement.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }
}
