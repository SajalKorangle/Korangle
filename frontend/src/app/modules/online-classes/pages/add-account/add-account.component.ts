import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AddAccountServiceAdapter } from './add-account.service.adapter';
import { AddAccountHtmlRenderer } from './add-account.html.renderer';
import { AddAccountUserInput } from './add-account.user.input';
import { AddAccountBackendData } from './add-account.backend.data';

@Component({
    selector: 'add-account',
    templateUrl: './add-account.component.html',
    styleUrls: ['./add-account.component.css'],
    providers: [ ],
})

export class AddAccountComponent implements OnInit {

    user: any;

    serviceAdapter: AddAccountServiceAdapter;
    htmlRenderer: AddAccountHtmlRenderer;
    userInput: AddAccountUserInput;
    backendData: AddAccountBackendData;

    isLoading: any;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new AddAccountUserInput();
        this.userInput.initialize(this);

        this.backendData = new AddAccountBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new AddAccountHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new AddAccountServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
