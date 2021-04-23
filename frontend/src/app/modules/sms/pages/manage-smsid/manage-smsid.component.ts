import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ManageSmsidServiceAdapter } from './manage-smsid.service.adapter';
import { ManageSmsidHtmlRenderer } from './manage-smsid.html.renderer';
import { ManageSmsidUserInput } from './manage-smsid.user.input';
import { ManageSmsidBackendData } from './manage-smsid.backend.data';

@Component({
    selector: 'page-name',
    templateUrl: './manage-smsid.component.html',
    styleUrls: ['./manage-smsid.component.css'],
    providers: [ ],
})

export class ManageSmsidComponent implements OnInit {

    user: any;

    serviceAdapter: ManageSmsidServiceAdapter;
    htmlRenderer: ManageSmsidHtmlRenderer;
    userInput: ManageSmsidUserInput;
    backendData: ManageSmsidBackendData;

    isLoading: any;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new ManageSmsidUserInput();
        this.userInput.initialize(this);

        this.backendData = new ManageSmsidBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new ManageSmsidHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ManageSmsidServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
