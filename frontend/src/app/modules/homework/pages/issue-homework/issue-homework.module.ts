import { NgModule } from '@angular/core';

import { IssueHomeworkComponent } from "./issue-homework.component";

import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';
import { EditHomeworkDialogComponent } from "./issue-homework.component";
import {IssueHomeworkRoutingModule } from './issue-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import 'hammerjs';


@NgModule({
    declarations: [
        IssueHomeworkComponent,
        EditHomeworkDialogComponent,
    ],

    imports: [
        IssueHomeworkRoutingModule ,
        ComponentsModule,
    ],
    exports: [
        ImagePreviewDialogComponent,
    ],
    providers: [],
    
    bootstrap: [IssueHomeworkComponent, EditHomeworkDialogComponent],
    
    entryComponents: [IssueHomeworkComponent ,EditHomeworkDialogComponent,ImagePreviewDialogComponent],
})
export class IssueHomeworkModule { }
