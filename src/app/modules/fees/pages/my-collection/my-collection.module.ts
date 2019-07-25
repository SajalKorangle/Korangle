import { NgModule } from '@angular/core';


import {MyCollectionRoutingModule, } from './my-collection.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {MyCollectionComponent} from "./my-collection.component";
import {FeesComponentsModule} from "../../components/fees-components.module";


@NgModule({
    declarations: [
        MyCollectionComponent
    ],

    imports: [
        MyCollectionRoutingModule ,
        ComponentsModule,
        FeesComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [MyCollectionComponent]
})
export class MyCollectionModule { }
