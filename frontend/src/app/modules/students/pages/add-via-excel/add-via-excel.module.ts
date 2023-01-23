import { NgModule } from '@angular/core';

import { AddViaExcelRoutingModule } from './add-via-excel.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddViaExcelComponent } from './add-via-excel.component';
import { DataLossWarningModalComponent } from './modals/data-loss-warning/data-loss-warning-modal.component';
import { FilePreviewImageModalComponent } from './modals/file-preview-image-modal/file-preview-image-modal.component';
import { GuidelinesModalComponent } from './modals/guidelines-modal/guidelines-modal.component';
import { MapHeadersModalComponent } from './modals/map-headers-modal/map-headers-modal.component';


@NgModule({
    declarations: [
        AddViaExcelComponent,
        DataLossWarningModalComponent,
        FilePreviewImageModalComponent,
        GuidelinesModalComponent,
        MapHeadersModalComponent,
    ],

    imports: [
        AddViaExcelRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AddViaExcelComponent],
    entryComponents: [
        DataLossWarningModalComponent,
        FilePreviewImageModalComponent,
        GuidelinesModalComponent,
        MapHeadersModalComponent,
    ],
})
export class AddViaExcelModule {}
