import { NgModule } from '@angular/core';


import { TotalCollectionRoutingModule} from './total-collection.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {TotalCollectionComponent} from "./total-collection.component";
import {FeesComponentsModule} from "../../components/fees-components.module";


@NgModule({
    declarations: [
        TotalCollectionComponent
    ],

    imports: [
        TotalCollectionRoutingModule ,
        ComponentsModule,
        FeesComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [TotalCollectionComponent]
})
export class TotalCollectionModule { }
