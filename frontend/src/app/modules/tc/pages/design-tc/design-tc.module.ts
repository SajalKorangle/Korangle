import { NgModule } from '@angular/core';

import { DesignTCRoutingModule } from './design-tc.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { DesignTCComponent } from "./design-tc.component";


@NgModule({
    declarations: [
        DesignTCComponent
    ],

    imports: [
        DesignTCRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [DesignTCComponent]
})
export class DesignTCModule { }
