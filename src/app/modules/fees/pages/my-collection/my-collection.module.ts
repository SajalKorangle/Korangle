import { NgModule } from '@angular/core';


import {MyCollectionRoutingModule, } from './my-collection.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {MyCollectionComponent} from "./my-collection.component";


@NgModule({
    declarations: [
        MyCollectionComponent
    ],

    imports: [
        MyCollectionRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [MyCollectionComponent]
})
export class MyCollectionModule { }
