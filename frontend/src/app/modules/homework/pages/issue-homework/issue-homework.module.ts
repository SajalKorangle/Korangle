import { NgModule } from '@angular/core';

import { IssueHomeworkComponent } from "./issue-homework.component";


import { ImagePreviewDialogComponent } from "./issue-homework.component";
import { EditHomeworkDialogComponent } from "./issue-homework.component";
import {IssueHomeworkRoutingModule } from './issue-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        IssueHomeworkComponent,
        EditHomeworkDialogComponent,
        ImagePreviewDialogComponent,
    ],

    imports: [
        IssueHomeworkRoutingModule ,
        ComponentsModule,
    ],
    exports: [
        ImagePreviewDialogComponent,
    ],
    providers: [],
    
    bootstrap: [IssueHomeworkComponent, EditHomeworkDialogComponent,ImagePreviewDialogComponent],
    
    entryComponents: [IssueHomeworkComponent ,EditHomeworkDialogComponent,ImagePreviewDialogComponent],
})
export class IssueHomeworkModule { }
