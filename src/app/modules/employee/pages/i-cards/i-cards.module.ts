import { NgModule } from '@angular/core';

import { ICardsComponent } from "./i-cards.component";

import {ICardsRoutingModule } from './i-cards.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        ICardsComponent
    ],

    imports: [
        ICardsRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ICardsComponent]
})
export class ICardsModule { }
