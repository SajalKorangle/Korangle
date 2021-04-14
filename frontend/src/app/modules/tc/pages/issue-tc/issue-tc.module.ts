import { NgModule } from '@angular/core';

import { IssueTCRoutingModule } from './issue-tc.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { IssueTCComponent } from "./issue-tc.component";


@NgModule({
    declarations: [
        IssueTCComponent
    ],

    imports: [
        IssueTCRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [IssueTCComponent]
})
export class IssueTCModule { }
