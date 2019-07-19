import { NgModule } from '@angular/core';


import { ViewProfileRoutingModule} from './view-profile.routing';
import {ComponentsModule} from "../../.././components/components.module";
import {ViewProfileComponent} from "./view-profile.component";


@NgModule({
    declarations: [
        ViewProfileComponent
    ],

    imports: [
        ViewProfileRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewProfileComponent]
})
export class ViewProfileModule { }
