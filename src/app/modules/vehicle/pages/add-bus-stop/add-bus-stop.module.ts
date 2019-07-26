import { NgModule } from '@angular/core';


import {AddBusStopRoutingModule} from './add-bus-stop.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {AddBusStopComponent} from "./add-bus-stop.component";


@NgModule({
    declarations: [
        AddBusStopComponent
    ],

    imports: [
        AddBusStopRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddBusStopComponent]
})
export class AddBusStopModule { }
