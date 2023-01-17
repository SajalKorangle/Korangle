import { NgModule } from '@angular/core';

import { AddViaExcelRoutingModule } from './add-via-excel.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddViaExcelComponent } from './add-via-excel.component';
import { DataLossWarningModalComponent } from './modals/data-loss-warning/data-loss-warning-modal.component';


@NgModule({
    declarations: [
        AddViaExcelComponent,
        DataLossWarningModalComponent,
    ],

    imports: [
        AddViaExcelRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AddViaExcelComponent],
    entryComponents: [
        DataLossWarningModalComponent
    ],
})
export class AddViaExcelModule {}
