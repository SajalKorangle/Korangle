import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { InventoryDialogComponent } from './dialogs/inventory-dialog/inventory-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
    declarations: [InventoryDialogComponent, InventoryComponent],
    imports: [ComponentsModule, MatProgressSpinnerModule],
    entryComponents: [InventoryDialogComponent],
    exports: [InventoryComponent],
})
export class LocalComponentsModule { }