import { NgModule } from '@angular/core';


import { TotalCollectionRoutingModule} from './total-collection.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {TotalCollectionComponent} from "./total-collection.component";


@NgModule({
    declarations: [
        TotalCollectionComponent
    ],

    imports: [
        TotalCollectionRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [TotalCollectionComponent]
})
export class TotalCollectionModule { }
