import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import {InventoryModule} from './inventory/inventory.module'

@NgModule({
    declarations: [],
    imports: [ComponentsModule, InventoryModule],
    entryComponents: [],
    exports: [InventoryModule],
})
export class LocalComponentsModule { }