import { ViewDevicesComponent } from './view-devices.component';

import { Query } from '@services/generic/query';

export class ViewDevicesServiceAdapter {
    vm: ViewDevicesComponent;

    constructor() {}

    initializeAdapter(vm: ViewDevicesComponent): void {
        this.vm = vm;
    }

    public initializeData(): void {

        this.vm.isLoading = true;
        this.getLoginList().then(() => {
            this.vm.isLoading = false;
        } );
    }

    /* Starts: Function to fetch login data ( logged in devices ) */
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
            login.last_active = this.formatDateTime(login.last_active);
            login.login_date = this.formatDateTime(login.login_date);
            login.loading = false;
            if ( login.token === token ) {
                this.vm.currID = login.id;
            }
            i = i + 1;
            return login;
        });
        this.vm.loginList = loginData;
    }
    /* Ends: Function to fetch login data ( logged in devices ) */

    /* Starts: Function to delete a login instance */
    async logoutInstance(instance: any) {

        let idx = this.vm.loginList.indexOf(instance);

        this.vm.loginList[idx].loading = true;

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
            const index = this.vm.loginList.indexOf(instance);
            if (index > -1) {
                this.vm.loginList.splice(index, 1);
            }
        }
    }
    /* Ends: Function to delete a login instance */

    /* Starts: Function to format date */
    formatDateTime(datetime: string) : string {
        var year = datetime.substring(0, 4);
        var month = datetime.substring(5, 7);
        var day = datetime.substring(8, 10);
        var hour = parseInt(datetime.substring(11, 13));
        var min = parseInt(datetime.substring(14, 16));

        hour = hour + 5;
        min = min + 30;

        var temp = Math.floor(min / 60);

        min = min - temp * 60;
        hour = hour + temp;

        var min2 = min >= 10 ? min : ("0" + min);

        const formatedDateTime = hour + ":" + min2 + ", " + day + "-" + month + "-" + year;

        return formatedDateTime;
    }
    /* Ends: Function to format date */
}
