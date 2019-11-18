import { NgModule } from '@angular/core';

import {ComponentsModule} from "../../components/components.module";

import { ClassComponent } from './class.component';

import { ClassRoutingModule } from './class.routing';


@NgModule({
    declarations: [

        ClassComponent,

    ],

    imports: [
        ComponentsModule,
        ClassRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ClassComponent],
})
export class ClassModule { }
