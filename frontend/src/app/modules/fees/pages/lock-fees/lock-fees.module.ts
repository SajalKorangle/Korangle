import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips'

import {LockFeesRoutingModule,} from './lock-fees.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {LockFeesComponent} from "./lock-fees.component";


@NgModule({
    declarations: [
        LockFeesComponent
    ],

    imports: [
        LockFeesRoutingModule ,
        ComponentsModule,
        MatChipsModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [LockFeesComponent]
})
export class LockFeesModule { }
