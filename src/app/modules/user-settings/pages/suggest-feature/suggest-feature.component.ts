import { Component, OnInit } from '@angular/core';

import { SuggestFeatureServiceAdapter } from "./suggest-feature.service.adapter";
import { DataStorage } from "../../../../classes/data-storage";
import {FeatureService} from "../../../../services/modules/feature/feature.service";

@Component({
  selector: 'create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css'],
    providers: [ FeatureService ],
})

export class SuggestFeatureComponent implements OnInit {

    user;

    currentFeature = {
        'id': null,
        'title': null,
        'why': null,
        'how': null,
        'what': null,
    };

    featureList = [];

    serviceAdapter: SuggestFeatureServiceAdapter;

    isLoading = false;

    constructor (public featureService: FeatureService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SuggestFeatureServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

}
