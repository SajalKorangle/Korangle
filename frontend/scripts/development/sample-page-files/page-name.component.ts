import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { PageNameServiceAdapter } from './page-name.service.adapter';
import { PageNameHtmlRenderer } from './page-name.html.renderer';

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

    userInput = {};
    backendData = {};
    stateKeeper = { isLoading: false };
    

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new PageNameHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new PageNameServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
