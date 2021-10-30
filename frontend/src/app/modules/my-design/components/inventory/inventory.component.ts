import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';

// Backend Service
import { GenericService } from '@services/generic/generic-service';

// Types
import { Layout } from '@services/modules/generic-design/models/layout';
import { LayoutSharing } from '@services/modules/generic-design/models/layout-sharing';

import { InventoryServiceAdapter } from './inventory.service.adapter';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css'],
    providers: [GenericService]
})
export class InventoryComponent implements OnInit {

    user = DataStorage.getInstance().getUser();
    serviceAdapter = new InventoryServiceAdapter(this);

    isLoading = true;

    backendData: {
        myLayoutList: Array<Layout>,
        publicLayoutList: Array<Layout>
        layoutSharingSharedWithMeList: Array<LayoutSharing>,
    } = {
            myLayoutList: [],
            publicLayoutList: [],
            layoutSharingSharedWithMeList: [],
        };



    constructor(
        public genericService: GenericService,
    ) { }

    ngOnInit() {
        this.serviceAdapter.initializeDate();
    }

    openInventory() {

    }

}
