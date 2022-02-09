import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { ParentSupportComponent } from './parent-support.component';
import { ParentSupportRoutingModule } from './parent-support.routing';
import { PrintCountAllTableParentSupportComponent } from './print/print-count-all-table-parent-support/print-count-all-table-parent-support.component';
import { ImagePdfPreviewDialogComponent } from "../../components/image-pdf-preview-dialog/image-pdf-preview-dialog.component";

@NgModule({
    declarations: [
        ParentSupportComponent,
        PrintCountAllTableParentSupportComponent,
    ],

    imports: [ComponentsModule, ParentSupportRoutingModule],
    exports: [ImagePdfPreviewDialogComponent],
    entryComponents: [ImagePdfPreviewDialogComponent],
    providers: [],
    bootstrap: [ParentSupportComponent],
})
export class ParentSupportModule { }
