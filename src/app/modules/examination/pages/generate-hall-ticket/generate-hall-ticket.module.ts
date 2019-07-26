import { NgModule } from '@angular/core';

import {GenerateHallTicketRoutingModule} from './generate-hall-ticket.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GenerateHallTicketComponent} from "./generate-hall-ticket.component";


@NgModule({
    declarations: [
        GenerateHallTicketComponent
    ],

    imports: [
        GenerateHallTicketRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateHallTicketComponent]
})
export class GenerateHallTicketModule { }
