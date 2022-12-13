import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { UpdateViaExcelRoutingModule } from './update-via-excel.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateViaExcelComponent } from './update-via-excel.component';

// import { LocalComponentsModule } from '@modules/students/pages/update-via-excel/component/local-components.module';
// import { CheckSoftwareIdModalComponent } from '@modules/students/pages/update-via-excel/component/check-software-id-modal/check-software-id-modal.component';
// import { DataLossWarningModalComponent } from '@modules/students/pages/update-via-excel/component/data-loss-warning-modal/data-loss-warning-modal.component';


@NgModule({
    declarations: [
        UpdateViaExcelComponent,
    ],

    imports: [
        UpdateViaExcelRoutingModule,
        ComponentsModule,
        // LocalComponentsModule,
        MatButtonToggleModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [UpdateViaExcelComponent],
    entryComponents: [
        // CheckSoftwareIdModalComponent,
        // DataLossWarningModalComponent,
    ],
})
export class UpdateViaExcelModule {}
