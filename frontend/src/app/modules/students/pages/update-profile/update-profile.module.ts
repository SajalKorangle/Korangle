import { NgModule } from '@angular/core';


import { UpdateProfileRoutingModule} from './update-profile.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {UpdateProfileComponent} from "./update-profile.component";

import {ImagePdfPreviewDialogModule} from "../../image-pdf-preview-dialog/image-pdf-preview-dialog.module";
import {MultipleFileDialogModule} from '../../multiple-file-dialog/multiple-file-dialog.module';

@NgModule({
    declarations: [
        UpdateProfileComponent
    ],

    imports: [
        UpdateProfileRoutingModule ,
        ComponentsModule,
        MultipleFileDialogModule,
        ImagePdfPreviewDialogModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateProfileComponent]
})
export class UpdateProfileModule { }
