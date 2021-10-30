import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataStorage } from '../../../../classes/data-storage';


// Backend Services
import { GenericService } from '@services/generic/generic-service';

// For Types
import { User } from '@classes/user';
import { Layout } from '@services/modules/generic-design/models/layout';
// import { LayoutShare } from '@services/modules/generic-design/models/layout-share';

import { DesignLayoutHtmlRenderer } from './design-layout.html.renderer';
import { DesignLayoutServiceAdapter } from './design-layout.service.adapter';

// Design Core
import { getDefaultLayoutContent } from '@modules/my-design/core/constant'

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

    user: User = DataStorage.getInstance().getUser();

    activeLayout: Layout = new Layout({parentSchool: this.user.activeSchool.dbId, name: '', content: getDefaultLayoutContent()});

    backendData: {
    } = {
        };

    serviceAdapter = new DesignLayoutServiceAdapter(this);
    htmlRenderer = new DesignLayoutHtmlRenderer(this);

    isLoading = true;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.serviceAdapter.initializeDate();
        console.log('main component: ', this);
    }

    setActiveLayout = (data: {layout: Layout, copy?: boolean}) => {
        const {layout, copy} = data;
        // properly copy the layout if copy is true
        this.activeLayout = layout;
    }

}
