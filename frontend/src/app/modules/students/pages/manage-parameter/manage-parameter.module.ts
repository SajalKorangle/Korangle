import { NgModule } from '@angular/core';

import {ManageParameterRouting} from './manage-parameter.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ManageParameterComponent} from "./manage-parameter.component";


@NgModule({
    declarations: [
        ManageParameterComponent
    ],

    imports: [
        ManageParameterRouting,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ManageParameterComponent]
})
export class ManageParameterModule { }
