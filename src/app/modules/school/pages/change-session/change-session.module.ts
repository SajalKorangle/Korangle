import { NgModule } from '@angular/core';

import { ChangeSessionRoutingModule } from './change-session.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ChangeSessionComponent } from "./change-session.component";


@NgModule({
    declarations: [
        ChangeSessionComponent,
    ],

    imports: [
        ChangeSessionRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ChangeSessionComponent]
})
export class ChangeSessionModule { }
