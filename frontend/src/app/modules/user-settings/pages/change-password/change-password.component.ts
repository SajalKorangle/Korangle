import { Component, Input } from '@angular/core';

import { UserOldService } from '../../../../services/modules/user/user-old.service';
import { Query } from '@services/generic/query';
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

    signOutFromAll: boolean = false;

    isLoading = false;

    constructor(private userSettingsService: UserOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    changePassword(): void {
        if (!this.oldPassword || !this.newPassword) {
            alert('Please enter old and new password');
            return;
        }

        if (!this.confirmPassword) {
            alert('Please confirm the new password');
            return;
        }

        if (this.confirmPassword !== this.newPassword) {
            alert('New Password and confirm password are not same');
            return;
        }

        if (this.newPassword == this.oldPassword) {
            alert('New Password cannot be same as old password');
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
                this.signOutFromAllDevices();
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    // Starts: Function to sign out user from all other devices
    async signOutFromAllDevices() {
        if (this.signOutFromAll) {
            const token = localStorage.getItem('schoolJWT');

            const deleteResponsePromise = new Query()
                .filter({ parentUser: this.user.id })
                .exclude({ token: token })
                .deleteObjectList({ authentication_app: 'DeviceList' });
        }
        this.signOutFromAll = false;
    }
    // Ends: Function to sign out user from all other devices
}
