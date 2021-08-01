import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { InventoryDialogComponent } from './dialogs/inventory-dialog/inventory-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [InventoryDialogComponent],
    imports: [ComponentsModule, MatProgressSpinnerModule],
    entryComponents: [InventoryDialogComponent],
    exports: [],
})
export class LocalComponentsModule { }