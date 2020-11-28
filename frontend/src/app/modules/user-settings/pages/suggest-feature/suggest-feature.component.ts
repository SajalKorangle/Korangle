import {Component, OnInit} from '@angular/core';

import {SuggestFeatureServiceAdapter} from './suggest-feature.service.adapter';
import {DataStorage} from '../../../../classes/data-storage';
import {FeatureService} from '../../../../services/modules/feature/feature.service';

@Component({
    selector: 'suggest-feature',
    templateUrl: './suggest-feature.component.html',
    styleUrls: ['./suggest-feature.component.css'],
    providers: [FeatureService],
})

export class SuggestFeatureComponent implements OnInit {

    user;

    currentFeature: any;

    featureList = [];

    serviceAdapter: SuggestFeatureServiceAdapter;

    isLoading = false;

    constructor(public featureService: FeatureService) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.initializeCurrentFeature();

        this.serviceAdapter = new SuggestFeatureServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    initializeCurrentFeature(): void {
        this.currentFeature = {
            'id': null,
            'parentUser': this.user.id,
            'title': null,
            'description': null,
        };
    }

}
