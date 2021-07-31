import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { InventoryDialogComponent } from './dialogs/inventory-dialog/inventory-dialog.component';

@NgModule({
    declarations: [InventoryDialogComponent],
    imports: [ComponentsModule],
    entryComponents: [InventoryDialogComponent],
    exports: [],
})
export class LocalComponentsModule { }