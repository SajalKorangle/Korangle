import { NgModule } from '@angular/core';

import { IssueHomeworkComponent } from "./issue-homework.component";

import {IssueHomeworkRoutingModule } from './issue-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        IssueHomeworkComponent
    ],

    imports: [
        IssueHomeworkRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    
    bootstrap: [IssueHomeworkComponent]
})
export class IssueHomeworkModule { }
