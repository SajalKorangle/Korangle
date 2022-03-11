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
}
