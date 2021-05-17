import {Component, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {SettingsHtmlRenderer} from '@modules/homework/pages/settings/settings.html.renderer';
import {SettingsServiceAdapter} from '@modules/homework/pages/settings/settings.service.adapter';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [],
})
export class SettingsComponent {
    user: any;

    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;

    stateKeeper = {
        isLoading: false,
    };

    homeWorkEvents = [{
        name: 'Homework Creation'
    }, {
        name: 'Homework Updation'
    }, {
        name: 'Homework Deletion'
    }, {
        name: 'Homework Resubmission'
    }, {
        name: 'Homework Checked'
    }];


    constructor() {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.htmlRenderer = new SettingsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }

}
