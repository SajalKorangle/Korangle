import { NgModule } from '@angular/core';

import { CountAllRoutingModule } from './count-all.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { CountAllComponent } from "./count-all.component";

@NgModule({
    declarations: [CountAllComponent],

    imports: [CountAllRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [CountAllComponent],
})
export class CountAllModule { }
