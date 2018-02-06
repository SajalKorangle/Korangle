import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { User } from './classes/user';
import {AuthenticationService} from './services/authentication.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
	providers: [AuthenticationService],
})
export class AppComponent implements OnInit {

	private user = new User();

  constructor(private authenticationService: AuthenticationService,
			  public location: Location) {}

  ngOnInit() {
  	if (this.user.checkAuthentication()) {
  		this.authenticationService.getUserDetails(this.user.jwt).then( data => {
  			this.user.initializeUserData(data);
		});
	}
		$.material.options.autofill = true;
		$.material.init();
  }

	isMaps(path){
		let title = this.location.prepareExternalUrl(this.location.path());
		title = title.slice( 1 );
		if (path == title){
			return false;
		}
		else {
			return true;
		}
	}

}
