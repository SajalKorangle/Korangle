import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { InventoryDialogComponent } from './components/inventory-dialog/inventory-dialog.component';

// Backend Service
import { GenericService } from '@services/generic/generic-service';

// Types
import { Layout } from '@services/modules/generic-design/models/layout';
import { LayoutShare } from '@services/modules/generic-design/models/layout-share';

import { InventoryServiceAdapter } from './inventory.service.adapter';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css'],
    providers: [GenericService, MatDialog,]
})
export class InventoryComponent implements OnInit {

    @Output() openLayout = new EventEmitter<any>();

    backendData: {
        myLayoutList: Array<Layout>,
        publicLayoutList: Array<Layout>;
        layoutSharingSharedWithMeList: Array<LayoutShare>,
    } = {
            myLayoutList: [],
            publicLayoutList: [],
            layoutSharingSharedWithMeList: [],
        };


    user = DataStorage.getInstance().getUser();
    serviceAdapter = new InventoryServiceAdapter(this);

    isLoading = true;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.serviceAdapter.initializeDate();
    }

    openInventory() {
        const data = {
            vm: this,
        };

        const openedDialog = this.dialog.open(InventoryDialogComponent, { data });

        openedDialog.afterClosed().subscribe((selection: any) => {
            if (selection) {
                // Open Layout in The Editor 
            }
        });
    }

}
