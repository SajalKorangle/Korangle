import { NgModule } from '@angular/core';

import { CheckHomeworkComponent } from "./check-homework.component";

import {CheckHomeworkRoutingModule } from './check-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { IssueHomeworkModule } from '../issue-homework/issue-homework.module';
import { ImagePreviewDialogComponent } from '../issue-homework/issue-homework.component';



@NgModule({
    declarations: [
        CheckHomeworkComponent,
    ],

    imports: [
        CheckHomeworkRoutingModule ,
        ComponentsModule,
        IssueHomeworkModule

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CheckHomeworkComponent],
    
    entryComponents: [CheckHomeworkComponent, ImagePreviewDialogComponent],
})
export class CheckHomeworkModule { }
