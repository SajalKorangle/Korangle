import { NgModule } from '@angular/core';

import {AddStudentRoutingModule} from './add-student.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {AddStudentComponent} from "./add-student.component";

import {ImagePdfPreviewDialogModule} from "../../image-pdf-preview-dialog/image-pdf-preview-dialog.module";
import {MultipleFileDialogModule} from '../../multiple-file-dialog/multiple-file-dialog.module';

@NgModule({
    declarations: [
        AddStudentComponent
    ],

    imports: [
        AddStudentRoutingModule ,
        ComponentsModule,
        MultipleFileDialogModule,
        ImagePdfPreviewDialogModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddStudentComponent]
})
export class AddStudentModule { }
