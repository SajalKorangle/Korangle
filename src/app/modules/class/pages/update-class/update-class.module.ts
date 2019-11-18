import { NgModule } from '@angular/core';


import {UpdateClassRoutingModule} from './update-class.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {UpdateClassComponent} from "./update-class.component";


@NgModule({
    declarations: [
        UpdateClassComponent
    ],

    imports: [
        UpdateClassRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateClassComponent]
})
export class UpdateClassModule { }
