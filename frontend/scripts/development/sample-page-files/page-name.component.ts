import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { PageNameServiceAdapter } from './page-name.service.adapter';
import { PageNameHtmlRenderer } from './page-name.html.renderer';
import { PageNameUserInput } from './page-name.user.input';
import { PageNameBackendData } from './page-name.backend.data';

@Component({
    selector: 'page-name',
    templateUrl: './page-name.component.html',
    styleUrls: ['./page-name.component.css'],
    providers: [ ],
})

export class PageNameComponent implements OnInit {

    user: any;

    serviceAdapter: PageNameServiceAdapter;
    htmlRenderer: PageNameHtmlRenderer;
    userInput: PageNameUserInput;
    backendData: PageNameBackendData;

    isLoading: any;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new PageNameUserInput();
        this.userInput.initialize(this);

        this.backendData = new PageNameBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new PageNameHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new PageNameServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
