import { Component, OnInit } from '@angular/core';

import { ManageLayoutServiceAdapter } from './manage-layout.service.adapter';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";

declare const $: any;

@Component({
    selector: 'manage-layout',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css'],
    providers: [
    ],
})

export class ManageLayoutComponent implements OnInit {

    user;

    
    serviceAdapter: ManageLayoutServiceAdapter;


    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
