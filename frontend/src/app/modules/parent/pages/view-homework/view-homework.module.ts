import { NgModule } from '@angular/core';


import { ViewHomeworkRoutingModule} from './view-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewHomeworkComponent} from "./view-homework.component";
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';
import { MatGridListModule } from '@angular/material/grid-list'


@NgModule({
    declarations: [
        ViewHomeworkComponent
    ],

    imports: [
        ViewHomeworkRoutingModule ,
        ComponentsModule,
        MatGridListModule,
    ],
    exports: [
        MatGridListModule,
    ],
    providers: [],
    bootstrap: [ViewHomeworkComponent, ImagePreviewDialogComponent]
})
export class ViewHomeworkModule { }
