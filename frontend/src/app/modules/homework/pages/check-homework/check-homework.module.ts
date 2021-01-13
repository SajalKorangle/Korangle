import { NgModule } from '@angular/core';

import { CheckHomeworkComponent } from "./check-homework.component";

import {CheckHomeworkRoutingModule } from './check-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';



@NgModule({
    declarations: [
        CheckHomeworkComponent,
    ],

    imports: [
        CheckHomeworkRoutingModule ,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CheckHomeworkComponent],
    
    entryComponents: [CheckHomeworkComponent, ImagePreviewDialogComponent],
})
export class CheckHomeworkModule { }
