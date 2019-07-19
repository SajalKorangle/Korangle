import { NgModule } from '@angular/core';


import {ICardsRoutingModule} from './i-cards.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ICardsComponent} from "./i-cards.component";


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
