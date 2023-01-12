import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';
import { RemoveDuplicateMarksHtmlAdapter } from './remove-duplicate-marks.html.adapter';
import { RemoveDuplicateMarksServiceAdapter } from './remove-duplicate-marks.service.adapter';

@Component({
    selector: 'remove-duplicate-marks',
    templateUrl: './remove-duplicate-marks.component.html',
    styleUrls: ['./remove-duplicate-marks.component.css'],
})

export class RemoveDuplicateMarksComponent implements OnInit {

    user;

    htmlAdapter: RemoveDuplicateMarksHtmlAdapter;
    serviceAdapter: RemoveDuplicateMarksServiceAdapter;

    subjectList: any;
    classList: any;
    sectionList: any;
    examinationList: any;

    isLoading = false;

    constructor() {}

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new RemoveDuplicateMarksHtmlAdapter();
        this.htmlAdapter.initialize(this);

        this.serviceAdapter = new RemoveDuplicateMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

}
