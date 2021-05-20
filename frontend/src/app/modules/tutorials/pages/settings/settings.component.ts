import {Component, OnInit} from '@angular/core';
import {SettingsServiceAdapter} from './settings.service.adapter';
import {DataStorage} from '@classes/data-storage';
import {SettingsHtmlRenderer} from '@modules/tutorials/pages/settings/settings.html.renderer';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;

    user: any;

    stateKeeper = {
        isLoading: false,
    };

    variablesAvailable = ['tutorialChapter', 'tutorialTopic', 'subject'];
    tutorialEvents = [{
        name: 'Tutorial Creation'
    }, {
        name: 'Tutorial Updation'
    }, {
        name: 'Tutorial Deletion'
    }];


    constructor() {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.htmlRenderer = new SettingsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }

}
