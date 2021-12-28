import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { GenericService } from '@services/generic/generic-service';
import { TrackEmployeeActivityServiceAdapter } from './track-employee-activity.service.adapter';

import { FilterModalComponent } from '@modules/activity/components/filter-modal/filter-modal.component';

import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-track-employee-activity',
    templateUrl: './track-employee-activity.component.html',
    styleUrls: ['./track-employee-activity.component.css'],
    providers: [GenericService],
})
export class TrackEmployeeActivityComponent implements OnInit {
    user;
    isLoading = false;

    activityRecordList = [];

    serviceAdapter: TrackEmployeeActivityServiceAdapter;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TrackEmployeeActivityServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    openFilterDialog() {
        const dialogRef = this.dialog.open(FilterModalComponent);

        dialogRef.afterClosed().subscribe((data) => {
            console.log("Closed");
        });
    }

}
