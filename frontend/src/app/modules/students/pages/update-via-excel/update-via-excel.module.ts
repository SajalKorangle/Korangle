import { NgModule } from '@angular/core';

import { UpdateViaExcelRoutingModule } from './update-via-excel.routing';
import { UpdateViaExcelComponent } from './update-via-excel.component';


@NgModule({
    declarations: [
        UpdateViaExcelComponent,
    ],

    imports: [
        UpdateViaExcelRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [UpdateViaExcelComponent],
    entryComponents: [
    ],
})
export class UpdateViaExcelModule {}
