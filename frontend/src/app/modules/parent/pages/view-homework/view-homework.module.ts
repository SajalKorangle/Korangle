import { NgModule } from '@angular/core';


import { ViewHomeworkRoutingModule} from './view-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewHomeworkComponent} from "./view-homework.component";
import { IssueHomeworkModule } from '../../../homework/pages/issue-homework/issue-homework.module';
import { ImagePreviewDialogComponent } from '../../../homework/pages/issue-homework/issue-homework.component';
import { MatGridListModule } from '@angular/material/grid-list'


@NgModule({
    declarations: [
        ViewHomeworkComponent
    ],

    imports: [
        ViewHomeworkRoutingModule ,
        ComponentsModule,
        IssueHomeworkModule,
        MatGridListModule,
    ],
    exports: [
        MatGridListModule,
    ],
    providers: [],
    bootstrap: [ViewHomeworkComponent, ImagePreviewDialogComponent]
})
export class ViewHomeworkModule { }
