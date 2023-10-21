import { NgModule } from '@angular/core';

import { ViewHistoryComponent } from "./view-history.component";

import {ViewHistoryRoutingModule } from './view-history.routing';
import {ComponentsModule} from "../../../../components/components.module";



@NgModule({
    declarations: [
        ViewHistoryComponent,
    ],

    imports: [
        ViewHistoryRoutingModule ,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewHistoryComponent],

})
export class ViewHistoryModule { }
