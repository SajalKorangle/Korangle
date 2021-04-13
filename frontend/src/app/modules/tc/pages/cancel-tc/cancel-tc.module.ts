import { NgModule } from '@angular/core';

import { CancleTCRoutingModule } from './cancel-tc.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { CancelTCComponent } from "./cancel-tc.component";


@NgModule({
    declarations: [
        CancelTCComponent
    ],

    imports: [
        CancleTCRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CancelTCComponent]
})
export class CancelTCModule { }
