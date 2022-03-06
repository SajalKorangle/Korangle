import { Component, Input } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';
import { Query } from '@services/generic/query';

@Component({
    selector: 'login-activity',
    templateUrl: './login-activity.component.html',
    styleUrls: ['./login-activity.component.css'],
    providers: [GenericService],
})
export class LoginActivityComponent {
    user;

    /* List of logins on multiple devices */
    loginList = [];

    /* Current device login's id*/
    currID = -1;

    isLoading = false;

    constructor(private genericService: GenericService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.loginList = [];

        this.getLoginList();

    }

    /* Function to fetch login data ( logged in devices ) */
    async getLoginList() {
        const token = localStorage.getItem('schoolJWT');
        const loginDataQuery = new Query()
            .filter({})
            .getObjectList({ authentication_app: 'DeviceList' });

        let loginData = [];
        [
            loginData,
        ] = await Promise.all([
            loginDataQuery,
        ]);

        loginData.sort(function(a: any, b: any) {
            return a.last_active > b.last_active ? -1 : 1;
          });
        
        let i = 0;
        loginData.forEach(login => {
            if(login.token === token){
                this.currID = login.id;
            }
            i = i + 1;
            return login;
        });
        
        this.loginList = loginData;
    }

    /* Function to delete a login instance */
    async logoutInstance(instance: any) {

        const deleteResponsePromise = new Query()
            .filter({ id: instance.id })
            .deleteObjectList({ authentication_app: 'DeviceList' });

        let deleteResponse = -1;
        [
            deleteResponse,
        ] = await Promise.all([
            deleteResponsePromise,
        ]);
        if ( deleteResponse === 1) {
            const index = this.loginList.indexOf(instance);
            if (index > -1) {
                this.loginList.splice(index, 1);
            }
        }
    }
}
