import { NgModule } from '@angular/core';

import { AddViaExcelRoutingModule } from './add-via-excel.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddViaExcelComponent } from './add-via-excel.component';


@NgModule({
    declarations: [
        AddViaExcelComponent,
    ],

    imports: [
        AddViaExcelRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AddViaExcelComponent],
    entryComponents: [
    ],
})
export class AddViaExcelModule {}
