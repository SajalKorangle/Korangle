import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { JoinAllServiceAdapter } from './join-all.service.adapter';
import { JoinAllHtmlRenderer } from './join-all.html.renderer';

@Component({
    selector: 'join-all',
    templateUrl: './join-all.component.html',
    styleUrls: ['./join-all.component.css'],
    providers: [ ],
})

export class JoinAllComponent implements OnInit {

    user: any;

    serviceAdapter: JoinAllServiceAdapter;
    htmlRenderer: JoinAllHtmlRenderer;

    userInput = {};
    backendData = {};
    stateKeeper = { isLoading: false };
    

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new JoinAllHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new JoinAllServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
