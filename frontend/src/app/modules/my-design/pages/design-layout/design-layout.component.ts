import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataStorage } from '../../../../classes/data-storage';


// Backend Services
import { GenericService } from '@services/generic/generic-service';

// For Types
import { User } from '@classes/user';
// import { Layout } from '@services/modules/generic-design/models/layout';
// import { LayoutShare } from '@services/modules/generic-design/models/layout-share';

import { DesignLayoutHtmlRenderer } from './design-layout.html.renderer';
import { DesignLayoutServiceAdapter } from './design-layout.service.adapter';

@Component({
    selector: 'app-design-layout',
    templateUrl: './design-layout.component.html',
    styleUrls: ['./design-layout.component.css'],
    providers: [
        GenericService,

        MatDialog,
    ],
})
export class DesignLayoutComponent implements OnInit {

    user: User;

    backendData: {
    } = {
        };

    serviceAdapter: DesignLayoutServiceAdapter;
    htmlRenderer: DesignLayoutHtmlRenderer;

    isLoading = true;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new DesignLayoutServiceAdapter(this);
        this.htmlRenderer = new DesignLayoutHtmlRenderer(this);

        this.serviceAdapter.initializeDate();
        console.log('main component: ', this);
    }

}
