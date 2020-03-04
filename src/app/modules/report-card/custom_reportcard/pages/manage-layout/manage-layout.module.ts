import { NgModule } from '@angular/core';

import {ComponentsModule} from "../../../../../components/components.module";

import { ManageLayoutRouting } from './manage-layout.routing';
import {ManageLayoutComponent} from "./manage-layout.component";


@NgModule({
    declarations: [
        ManageLayoutComponent
    ],

    imports: [
        ManageLayoutRouting ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ManageLayoutComponent]
})
export class ManageLayoutModule { }
