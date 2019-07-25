import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';
import {FeesComponentsModule} from "../fees/components/fees-components.module";

@NgModule({
    declarations: [

        ParentComponent,

    ],

    imports: [

        ComponentsModule,
        FeesComponentsModule,
        ParentRoutingModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
