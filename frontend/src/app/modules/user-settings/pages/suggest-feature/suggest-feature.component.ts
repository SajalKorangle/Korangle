import {Component, OnInit} from '@angular/core';

import {SuggestFeatureServiceAdapter} from './suggest-feature.service.adapter';
import {DataStorage} from '../../../../classes/data-storage';
import {FeatureService} from '../../../../services/modules/feature/feature.service';
import {SuggestFeatureHtmlRenderer} from '@modules/user-settings/pages/suggest-feature/suggest-feature.html.renderer';

@Component({
    selector: 'suggest-feature',
    templateUrl: './suggest-feature.component.html',
    providers: [FeatureService],
})

export class SuggestFeatureComponent implements OnInit {

    user;

    currentFeature: any;

    featureStatusList = {
        Pending: 'Pending',
        Rejected: 'Rejected',
        Resolved: 'Resolved',
    };

    featureList = [];

    advantageQues = 'What is the advantage of this feature?';
    frequencyQues = 'How frequently will this feature be used? (Hourly/Daily/Weekly/Monthly/Yearly)';
    managedQues = 'How are the things being managed currently without this feature?';


    serviceAdapter: SuggestFeatureServiceAdapter;
    htmlRenderer: SuggestFeatureHtmlRenderer;

    isLoading = false;

    constructor(public featureService: FeatureService) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new SuggestFeatureHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.serviceAdapter = new SuggestFeatureServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.initializeCurrentFeature();
    }

    initializeCurrentFeature(): void {
        this.currentFeature = {
            'id': null,
            'parentUser': this.user.id,
            'title': null,
            'description': null,
            'advantage': null,
            'frequency': null,
            'managedBy': null,
            'status': this.featureStatusList.Pending,
            'productManagerRemark': null,
        };
    }

}
