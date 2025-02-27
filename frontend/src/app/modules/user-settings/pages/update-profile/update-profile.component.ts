import { Component, Input, OnInit } from '@angular/core';

import { UserOldService } from '../../../../services/modules/user/user-old.service';
import { DataStorage } from '../../../../classes/data-storage';
import {VALIDATORS_REGX} from '@classes/regx-validators';

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css'],
    providers: [UserOldService],
})
export class UpdateProfileComponent implements OnInit {
    user;

    validators = VALIDATORS_REGX;

    first_name: any;
    last_name: any;
    email: any;

    isLoading = false;

    constructor(private userSettingsService: UserOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.first_name = this.user.first_name;
        this.last_name = this.user.last_name;
        this.email = this.user.email;
    }

    updateProfile(): void {
        if (this.email && !this.validators.email.test(this.email)) {
            alert('Kindly enter a valid email');
            return;
        }
        let data = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
        };

        this.isLoading = true;
        this.userSettingsService.updateProfile(data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert(response);
                this.user.first_name = this.first_name;
                this.user.last_name = this.last_name;
                this.user.email = this.email;
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
