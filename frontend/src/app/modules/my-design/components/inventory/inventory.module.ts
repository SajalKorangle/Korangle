import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { InventoryComponent } from './inventory.component';
import { InventoryDialogComponent } from './components/inventory-dialog/inventory-dialog.component';


@NgModule({
    declarations: [InventoryComponent, InventoryDialogComponent],
    imports: [
        ComponentsModule, 
        MatProgressSpinnerModule
    ],
    entryComponents: [InventoryDialogComponent],
    exports: [InventoryComponent]
})
export class InventoryModule { }
