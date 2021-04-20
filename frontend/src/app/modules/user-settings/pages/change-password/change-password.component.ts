import { Component, Input } from '@angular/core';

import { UserOldService } from '../../../../services/modules/user/user-old.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
    providers: [UserOldService],
})
export class ChangePasswordComponent {
    user;

    oldPassword: any;
    newPassword: any;
    confirmPassword: any;

    isLoading = false;

    constructor(private userSettingsService: UserOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    changePassword(): void {
        if (this.confirmPassword !== this.newPassword) {
            alert('New Password and confirm password are not same');
            return;
        }

        if (this.newPassword.length < 8) {
            alert('There should be atleast 8 characters in your password');
            return;
        }

        let data = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
        };

        this.isLoading = true;
        this.userSettingsService.changePassword(data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert(response);
                this.oldPassword = null;
                this.newPassword = null;
                this.confirmPassword = null;
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
