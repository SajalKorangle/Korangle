import { NgModule } from '@angular/core';

import { RegenerateTCRoutingModule } from './regenerate-tc.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { RegenerateTCComponent } from "./regenerate-tc.component";


@NgModule({
    declarations: [
        RegenerateTCComponent
    ],

    imports: [
        RegenerateTCRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [RegenerateTCComponent]
})
export class RegenerateTCModule { }
