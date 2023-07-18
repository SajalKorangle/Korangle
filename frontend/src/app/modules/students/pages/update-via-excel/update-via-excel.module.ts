import { NgModule } from '@angular/core';

import { UpdateViaExcelRoutingModule } from './update-via-excel.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateViaExcelComponent } from './update-via-excel.component';


@NgModule({
    declarations: [
        UpdateViaExcelComponent,
    ],

    imports: [
        UpdateViaExcelRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [UpdateViaExcelComponent],
    entryComponents: [
    ],
})
export class UpdateViaExcelModule {}
