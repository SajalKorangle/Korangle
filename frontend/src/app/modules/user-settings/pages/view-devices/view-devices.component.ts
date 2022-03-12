import { Component } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';

import { ViewDevicesServiceAdapter } from './view-devices.service.adapter';
import { ViewDevicesHtmlRenderer } from '@modules/user-settings/pages/view-devices/view-devices.html.renderer';

@Component({
    selector: 'view-devices',
    templateUrl: './view-devices.component.html',
    styleUrls: ['./view-devices.component.css'],
    providers: [GenericService],
})
export class ViewDevicesComponent {
    user;

    /* List of logins on multiple devices */
    loginList = [];

    /* Current device login's id*/
    currID = -1;

    htmlRenderer: ViewDevicesHtmlRenderer;

    serviceAdapter: ViewDevicesServiceAdapter;

    isLoading = false;

    constructor(private genericService: GenericService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.loginList = [];

        this.htmlRenderer = new ViewDevicesHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.serviceAdapter = new ViewDevicesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    /* Function to refresh list of devices */
    refreshLoginList() {
        this.serviceAdapter.getLoginList();
    }

    /* Function to logout a device login instance */
    logoutInstance(instance: any) {
        this.serviceAdapter.logoutInstance(instance);
    }

}
