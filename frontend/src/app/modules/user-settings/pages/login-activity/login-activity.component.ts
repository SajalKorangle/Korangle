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

    password: any;

    confirmed: boolean;

    loginList = [];

    isLoading = false;

    constructor(private genericService: GenericService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.confirmed = false;

        this.loginList = [];

        this.getLoginList();

    }

    async getLoginList() {

        this.confirmed = true;

        const loginDataQuery = new Query()
            .filter({ /* condition to exclude current device */ })
            .getObjectList({ authentication_app: 'DeviceList' });

        let loginData = [];
        [
            loginData,
        ] = await Promise.all([
            loginDataQuery,
        ]);

        loginData.sort(function(a:any,b:any){
            return a.last_active>b.last_active?-1:1;
          });

        this.loginList = loginData;
        
    }

    async logoutInstance(instance:any) {

        this.confirmed = true;

        const deleteResponsePromise = new Query()
            .filter({ id:instance.id })
            .deleteObjectList({ authentication_app: 'DeviceList' });

        let deleteResponse = [];
        [
            deleteResponse,
        ] = await Promise.all([
            deleteResponsePromise,
        ]);

        console.log(deleteResponse)
        
        const index = this.loginList.indexOf(instance);
        if (index > -1) {
            this.loginList.splice(index, 1);
        }
    }
    
}
